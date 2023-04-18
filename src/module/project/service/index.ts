import { Injectable } from "@nestjs/common"
import ProjectDto from "./dto"
import ProjectEntity from "./entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, IsNull, DataSource, In } from "typeorm"
import ProjectCategoryEntity from "../category/service/entity"
import ProjectBus from "../bus"
import ProjectCategoryBus from "../category/bus"

@Injectable()
export default class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private main: Repository<ProjectEntity>,
    @InjectRepository(ProjectCategoryEntity) private category: Repository<ProjectCategoryEntity>,
    private dataSource: DataSource,
    private bus: ProjectBus,
    private categoryBus: ProjectCategoryBus
  ) {
    this.categoryBus.beforeRemove(async (row, manager, onFinish) => {
      const origins = await this.main.find({ where: { type: row.id } })
      const projects: {
        row: ProjectEntity,
        origin: ProjectEntity
      }[] = []
      for (const origin of origins) {
        const row = await manager.save(this.main.merge(this.main.create(origin), { type: null }))
        projects.push({ row, origin })
      }
      onFinish(() => {
        projects.forEach(({ row, origin }) => {
          this.bus.update(row, origin)
        })
      })
    })
  }
  query(data: { type?: string | null }) {
    return this.main.find({
      where: {
        type: data.type === null ? IsNull() : data.type
      },
      order: {
        sort: 'ASC'
      }
    })
  }
  detail(id: string) {
    return this.main.findOne({
      where: { id }
    })
  }
  async save(dto: ProjectDto) {
    const data = {
      ...dto,
      id: dto.id === '' ? undefined : dto.id,
      type: dto.type && await this.category.exist({ where: { id: dto.type } }) ? dto.type : null
    }
    if (data.id) {
      const origin = await this.main.findOneOrFail({ where: { id: data.id } })
      const row = await this.main.save(data)
      this.bus.update(row, origin)
      return row
    } else {
      const row = await this.main.save(data)
      this.bus.add(row)
      return row
    }
  }
  async remove(data: { id: string } | { ids: string[] }) {
    const rows = await this.main.findBy({ id: In('id' in data ? [data.id] : data.ids) })
    const origins = rows.map(row => this.main.create(row))
    const handler = this.bus.handle()
    await this.dataSource.transaction(async manager => {
      for (const row of rows) {
        await this.bus.startRemove(row, manager, handler)
        await manager.remove(row)
      }
    })
    await handler.finish()
    this.bus.remove(origins)
    return true
  }
}