import { Injectable, Logger } from "@nestjs/common"
import ProjectDto from "./dto"
import ProjectEntity from "./entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, IsNull, In, DataSource } from "typeorm"
import ProjectCategoryEntity from "../category/service/entity"
import ProjectCategoryBus from "../category/bus"
import { SortSql } from "@/common/typeorm"
import { randomUUID } from 'crypto'
import ProjectEntityV1 from "./v1/entity"
import { getErrorMessage } from "@/common/utils"

@Injectable()
export default class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private main: Repository<ProjectEntity>,
    @InjectRepository(ProjectCategoryEntity) private category: Repository<ProjectCategoryEntity>,
    @InjectRepository(ProjectEntityV1) private old: Repository<ProjectEntityV1>,
    private categoryBus: ProjectCategoryBus,
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.categoryBus.beforeRemove(async ({ manager, databaseEntity }) => {
      for (const row of await this.main.find({ where: { type: databaseEntity.id } })) {
        row.type = null
        await manager.save(row)
      }
    })
  }
  async onModuleInit() {
    try {
      const table = this.old.metadata.tableName
      const runner = this.dataSource.createQueryRunner()
      if (await runner.hasTable(table)) {
        await this.main.manager.transaction(async manager => {
          const rows = await this.old.find()
          for (const row of rows) {
            const process = [{
              id: randomUUID(),
              name: '',
              context: row.context,
              command: row.dev,
              encoding: row.dev_proc?.encoding,
              env: row.dev_proc?.env
            }]
            if (row.build) {
              process.push({
                id: randomUUID(),
                name: 'Build',
                context: row.context,
                command: row.build,
                encoding: row.build_proc?.encoding,
                env: row.build_proc?.env
              })
            }
            await manager.save(
              this.main.create({
                id: row.id,
                name: row.name,
                type: row.type,
                sort: row.sort,
                created_at: row.created_at,
                process
              })
            )
          }
        })
        await runner.dropTable(table)
        this.logger.log('migrations finished', ProjectService)
      }
    } catch (e) {
      this.logger.error('migrations failed: ' + getErrorMessage(e), ProjectService)
    }
  }
  query(data: { type?: string | null }) {
    return this.main.createQueryBuilder()
      .where({
        type: data.type === null ? IsNull() : data.type
      })
      .orderBy(SortSql(), 'ASC')
      .getMany()
  }
  detail(id: string) {
    return this.main.findOne({
      where: { id }
    })
  }
  async process(id: string, process?: string) {
    const data = await this.main.findOne({
      where: { id },
      select: ['process']
    })
    if (process) {
      return data?.process?.find(row => row.id === process)
    } else {
      return data?.process?.[0]
    }
  }
  async save(dto: ProjectDto) {
    return await this.main.save({
      ...dto,
      id: dto.id === '' ? undefined : dto.id,
      type: dto.type && await this.category.exist({ where: { id: dto.type } }) ? dto.type : null,
      process: dto.process?.map(row => ({
        ...row,
        id: row.id ? row.id : randomUUID()
      }))
    })
  }
  async remove(data: { id: string } | { ids: string[] }) {
    const rows = await this.main.findBy({ id: In('id' in data ? [data.id] : data.ids) })
    await this.main.remove(rows)
    return true
  }
}