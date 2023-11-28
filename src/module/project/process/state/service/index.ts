import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import ProjectProcessStateEntity from "./entity"
import ProjectProcessBus from "../../bus"
import ProjectService from "../../../service"
import ProjectProcessService from "../../service"
import ConfigService from "@/module/config/service"
import CacheQueue from "@/common/cache-queue"

@Injectable()
export default class ProjectProcessStateService {
  constructor(
    @InjectRepository(ProjectProcessStateEntity) private main: Repository<ProjectProcessStateEntity>,
    private bus: ProjectProcessBus,
    private project: ProjectService,
    private process: ProjectProcessService,
    private logger: Logger,
    private config: ConfigService
  ) {
    this.init()
  }
  private async init() {
    this.bus.on(data => {
      if (data.action === 'status') {
        this.queue.add({
          id: data.id,
          status: data.value
        })
      }
    })
    this.queue.pull(async data => {
      const value = data.reduce((p, c) => (p[c.id] = c.status, p), {} as Record<string, boolean>)
      await this.write(value)
    })

    const data = await this.project.getAllProcess()
    const keepProcess = await this.config.getKeepProcess()

    for (const { process, id, name } of data) {
      if (process.autostart || (keepProcess && await this.status(process.id))) {
        const pid = await this.process.run(id, process.id)
        this.logger.log(`Autostart ${name}[${process.id}]: ${pid}`, 'ProjectProcessStateService')
      }
    }
  }
  async status(id: string) {
    const row = await this.main.findOneBy({ id })
    if (row) {
      return row.status
    }
    return false
  }
  private queue = new CacheQueue<{
    id: string
    status: boolean
  }>()

  private async write(data: Record<string, boolean>) {
    for (const id in data) {
      const value = data[id]
      const row = await this.main.findOneBy({ id })
      if (row) {
        await this.main.save(this.main.merge(row, { status: value }))
      } else {
        await this.main.save(this.main.create({ id, status: value }))
      }
    }
    this.logger.debug(`Write state: ${JSON.stringify(data)}`, 'ProjectProcessStateService')
  }
}