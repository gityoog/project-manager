import Options from "@/options"
import { Injectable } from "@nestjs/common"
import { InjectRepository, } from "@nestjs/typeorm"
import { Repository } from 'typeorm'
import ProjectOutputEntity from "./entity"
import fs from 'fs'
import path from 'path'
import { formatDate } from "@/common/utils/date"
import ProjectBus from "../../bus"
import ProjectService from "../../service"

@Injectable()
export default class ProjectOutputService {
  constructor(
    @InjectRepository(ProjectOutputEntity) private main: Repository<ProjectOutputEntity>,
    private options: Options,
    private projectBus: ProjectBus,
    private project: ProjectService
  ) {
    this.projectBus.beforeRemove(async ({ manager, databaseEntity }) => {
      await manager.remove(await this.main.find({ where: { project: databaseEntity.id } }))
    })
  }
  async query(projectId: string, processId?: string) {
    if (processId) {
      return this.main.find({
        select: ['id', 'name', 'size', 'created_at', 'process'],
        where: { project: projectId, process: processId },
        order: { created_at: 'DESC' }
      })
    } else {
      const project = await this.project.detail(projectId)
      if (!project) return []
      const result = await this.main.find({
        select: ['id', 'name', 'size', 'created_at', 'process'],
        where: { project: projectId },
        order: { created_at: 'DESC' }
      })
      const notOther: Record<string, boolean> = {}
      project.process?.forEach((process, index) => {
        if (index !== 0) {
          notOther[process.id] = true
        }
      })
      return result.filter(item => !item.process || !notOther[item.process])
    }
  }
  async remove(id: string) {
    const row = await this.main.findOneByOrFail({ id })
    const origin = this.main.create(row)
    if (row.path && fs.existsSync(row.path)) {
      fs.unlinkSync(row.path)
    }
    await this.main.remove(row)
    return origin
  }

  async read(id: string) {
    const data = await this.main.findOneBy({ id })
    return data
  }

  async save({ project, name, content, process }: {
    project: string
    process: string
    name: string
    content: Buffer
  }) {
    const entity = new ProjectOutputEntity()
    entity.project = project
    entity.name = name
    entity.process = process
    const filepath = path.resolve(this.options.output, formatDate(new Date(), 'YYYYMMDDHHmmss') + '_' + Math.random().toString(36).slice(2))
    entity.path = filepath
    fs.writeFileSync(filepath, content)
    // entity.content = content
    const length = content.length
    entity.size = `${(length / 1024 / 1024).toFixed(2)}MB`
    const row = await this.main.save(entity)
    return row
  }
  async clear() {
    const rows = await this.main.find()
    rows.forEach(row => {
      const filepath = row.path
      if (filepath && fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    })
    await this.main.clear()
  }
}