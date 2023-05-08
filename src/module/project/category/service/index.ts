import { Injectable } from "@nestjs/common"
import ProjectCategoryDto from "./dto"
import ProjectCategoryEntity from "./entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource, IsNull } from "typeorm"
import ProjectEntity from "../../service/entity"
import ProjectCategoryBus from "../bus"
import { SortSql } from "@/common/typeorm"

@Injectable()
export default class ProjectCategoryService {
  constructor(
    @InjectRepository(ProjectCategoryEntity) private main: Repository<ProjectCategoryEntity>,
    @InjectRepository(ProjectEntity) private project: Repository<ProjectEntity>,
    private dataSource: DataSource,
    private bus: ProjectCategoryBus
  ) { }
  async query() {
    const other = await this.project.exist({ where: { type: IsNull() } })
    const data = await this.main.createQueryBuilder()
      .orderBy(SortSql(), 'ASC')
      .getMany()
    return { data, other }
  }
  async save(dto: ProjectCategoryDto) {
    const data = { ...dto, id: dto.id === '' ? undefined : dto.id }
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
  async remove(id: string) {
    const row = await this.main.findOneOrFail({ where: { id: id } })
    const origin = this.main.create(row)
    const handler = this.bus.handle()
    await this.dataSource.transaction(async manager => {
      await this.bus.startRemove(row, manager, handler)
      await manager.remove(row)
    })
    await handler.finish()
    this.bus.remove(origin)
    return true
  }
}