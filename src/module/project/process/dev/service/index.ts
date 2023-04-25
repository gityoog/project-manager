import ConfigService from "@/module/config/service"
import LoggingService from "@/module/logging/service"
import ProjectBus from "@/module/project/bus"
import ProjectService from "@/module/project/service"
import ProjectEntity from "@/module/project/service/entity"
import { Injectable, Logger } from "@nestjs/common"
import NodeIpcService from "../../node-ipc"
import ProjectProcessDevBus from "../bus"
import DevTaskService from "./task"

@Injectable()
export default class ProjectProcessDevService {
  private data: Record<string, DevTaskService | undefined> = {}
  private keyDict: Record<string, DevTaskService | undefined> = {}
  constructor(
    private bus: ProjectProcessDevBus,
    private project: ProjectService,
    private projectBus: ProjectBus,
    private ipc: NodeIpcService,
    private config: ConfigService,
    private logging: LoggingService,
    private logger: Logger
  ) {
    this.init()
  }
  async run(id: string) {
    const row = await this.project.detail(id)
    const shell = await this.config.getShell()
    if (row) {
      const task = this.factory(row)
      return task.run(shell)
    }
    return false
  }
  stop(id: string) {
    this.get(id)?.stop()
  }
  info(id: string) {
    return this.get(id)?.info()
  }

  private init() {
    this.projectBus.onRemove(({ id }) => {
      const task = this.data[id]
      if (task) {
        task.destroy()
        delete this.data[id]
        delete this.keyDict[task.key]
      }
    })
    this.projectBus.onUpdate(row => {
      const task = this.data[row.id]
      if (task) {
        task.update(row)
      }
    })
    this.ipc.on('url', data => {
      const task = this.keyDict[data.id]
      if (task) {
        task.setUrl({
          host: data.host,
          port: data.port
        })
      }
    })
  }
  private factory(project: ProjectEntity) {
    const id = project.id
    const task = this.data[id]
    if (!task) {
      const task = new DevTaskService({
        project,
        bus: this.bus,
        logging: this.logging,
        ipc: this.ipc,
        logger: this.logger
      })
      this.data[id] = task
      this.keyDict[task.key] = task
      return task
    }
    return task
  }

  private get(id: string) {
    return this.data[id]
  }
}