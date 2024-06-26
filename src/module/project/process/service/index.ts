import { Injectable, Logger } from "@nestjs/common"
import ProjectProcessTaskService from "./task"
import ProjectBus from "../../bus"
import ProjectService from "../../service"
import NodeIpcService from "../node-ipc"
import ConfigService from "../../../config/service"
import ProjectOutputService from "../../ouput/service"
import ProjectProcessBus from "../bus"

@Injectable()
export default class ProjectProcessService {
  private data: Record<string, Record<string, ProjectProcessTaskService>> = {}
  constructor(
    private projectBus: ProjectBus,
    private project: ProjectService,
    private logger: Logger,
    private ipc: NodeIpcService,
    private config: ConfigService,
    private output: ProjectOutputService,
    private bus: ProjectProcessBus,
  ) {
    this.projectBus.onProcessRemove((process, id) => {
      if (this.data[id] && this.data[id][process.id]) {
        this.data[id][process.id].destroy()
        delete this.data[id][process.id]
      }
    })
    this.projectBus.onProcessUpdate((process, id) => {
      if (this.data[id] && this.data[id][process.id]) {
        this.data[id][process.id].setData(process)
      }
    })
  }

  private async factory(projectId: string, id?: string, create = false) {
    if (!this.data[projectId]) {
      this.data[projectId] = {}
    }
    let process = null
    if (!id) {
      process = await this.project.process(projectId, id)
      if (!process) return null
      id = process.id
    }
    if (!this.data[projectId][id] && create) {
      const project = await this.project.detail(projectId)
      if (!project) return null
      if (!process) {
        process = await this.project.process(projectId, id)
      }
      if (!process) return null
      this.data[projectId][process.id] = new ProjectProcessTaskService({
        project,
        data: process,
        ipc: this.ipc,
        logger: this.logger,
        config: this.config,
        output: this.output,
        bus: this.bus
      })
    }
    return this.data[projectId][id] || null
  }

  async run(project: string, id?: string) {
    const process = await this.factory(project, id, true)
    return process?.run() || null
  }
  async stop(project: string, id?: string) {
    const process = await this.factory(project, id)
    return process?.stop() || false
  }
  async info(project: string, id?: string) {
    const process = await this.factory(project, id)
    return process?.info() || null
  }
}