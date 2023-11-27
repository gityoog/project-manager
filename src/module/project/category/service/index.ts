import { Injectable } from "@nestjs/common"
import ProjectCategoryDto from "./dto"
import ProjectCategoryEntity from "./entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, IsNull } from "typeorm"
import ProjectEntity from "../../service/entity"
import { SortSql } from "@/common/typeorm"

@Injectable()
export default class ProjectCategoryService {
  constructor(
    @InjectRepository(ProjectCategoryEntity) private main: Repository<ProjectCategoryEntity>,
    @InjectRepository(ProjectEntity) private project: Repository<ProjectEntity>,
  ) { }
  async query() {
    const other = await this.project.exist({ where: { type: IsNull() } })
    const data = await this.main.createQueryBuilder()
      .orderBy(SortSql(), 'ASC')
      .getMany()
    return { data, other }
  }
  async save(dto: ProjectCategoryDto) {
    await this.main.save({ ...dto, id: dto.id === '' ? undefined : dto.id })
  }
  async remove(id: string) {
    const row = await this.main.findOneOrFail({ where: { id: id } })
    await this.main.remove(row)
    return true
  }
}