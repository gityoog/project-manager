import { Injectable, } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from 'typeorm'
import ProjectBus from "../../bus"
import ProjectOutputBus from "../bus"
import ProjectOutputEntity from "./entity"

@Injectable()
export default class ProjectOutputService {
  constructor(
    @InjectRepository(ProjectOutputEntity) private main: Repository<ProjectOutputEntity>,
    private projectBus: ProjectBus,
    private bus: ProjectOutputBus
  ) {
    this.projectBus.beforeRemove(async (row, manager, onFinish) => {
      const rows = await this.main.findBy({ project: row.id })
      await manager.remove(rows)
      onFinish(() => this.bus.remove(rows))
    })
  }
  query(project: string) {
    return this.main.find({
      select: ['id', 'name', 'size', 'created_at'],
      where: { project },
      order: { created_at: 'DESC' }
    })
  }
  async remove(id: string) {
    const row = await this.main.findOneByOrFail({ id })
    const origin = this.main.create(row)
    await this.main.remove(row)
    this.bus.remove(origin)
    return origin
  }

  async read(id: string) {
    const data = await this.main.findOneBy({ id })
    return data
  }

  async save({ project, name, content }: {
    project: string
    name: string
    content: Buffer
  }) {
    const entity = new ProjectOutputEntity()
    entity.project = project
    entity.name = name
    entity.content = content
    const length = content.length
    entity.size = `${(length / 1024 / 1024).toFixed(2)}MB`
    const row = await this.main.save(entity)
    this.bus.add(row)
    return row
  }
}