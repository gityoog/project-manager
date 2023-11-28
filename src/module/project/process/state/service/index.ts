import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import ProjectProcessStateEntity from "./entity"
import ProjectProcessBus from "../../bus"
import ProjectService from "../../../service"
import ProjectProcessService from "../../service"

@Injectable()
export default class ProjectProcessStateService {
  constructor(
    @InjectRepository(ProjectProcessStateEntity) private main: Repository<ProjectProcessStateEntity>,
    private bus: ProjectProcessBus,
    private project: ProjectService,
    private process: ProjectProcessService,
    private logger: Logger
  ) {
    this.init()
  }
  private async init() {
    this.bus.on(data => {
      if (data.action === 'status') {
        this.addCache(data.id, data.value)
      }
    })
  }

  async status(id: string) {
    const row = await this.main.findOneBy({ id })
    if (row) {
      return row.status
    }
    return false
  }

  private cache: Record<string, boolean> | null = null
  private addCache(id: string, status: boolean) {
    if (this.cache === null) {
      this.cache = {}
    }
    this.cache[id] = status
    this.addUpdater()
  }
  private updater: NodeJS.Timeout | null = null
  private lock = false
  private addUpdater() {
    if (this.lock) return
    if (!this.cache) return
    if (this.updater) {
      clearTimeout(this.updater)
    }
    this.updater = setTimeout(() => {
      this.flush()
    }, 3000)
  }
  private async flush() {
    if (this.cache) {
      const data = this.cache
      this.cache = null
      this.lock = true
      for (const id in data) {
        const value = data[id]
        const row = await this.main.findOneBy({ id })
        if (row) {
          await this.main.save(this.main.merge(row, { status: value }))
        } else {
          await this.main.save(this.main.create({ id, status: value }))
        }
      }
      this.lock = false
      this.addUpdater()
    }
  }
}