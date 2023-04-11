import ProjectBus from "@/module/project/bus"
import ProjectOutputService from "@/module/project/ouput/service"
import ProjectService from "@/module/project/service"
import ProjectEntity from "@/module/project/service/entity"
import { Injectable } from "@nestjs/common"
import { ClsServiceManager } from "nestjs-cls"
import NodeIpcService from "../../node-ipc"
import ProjectProcessBuildBus from "../bus"
import BuildTaskService from "./task"

@Injectable()
export default class ProjectProcessBuildService {
  private data: Record<string, BuildTaskService | undefined> = {}
  private keyDict: Record<string, BuildTaskService | undefined> = {}
  constructor(
    private bus: ProjectProcessBuildBus,
    private project: ProjectService,
    private projectBus: ProjectBus,
    private ipc: NodeIpcService,
    private output: ProjectOutputService
  ) {
    this.init()
  }
  async run(id: string) {
    const row = await this.project.detail(id)
    if (row) {
      const task = this.factory(row)
      return task.run()
    }
    return false
  }
  stop(id: string) {
    const task = this.get(id)
    if (task) {
      return task.stop()
    }
    return true
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
    this.ipc.on('dist', data => {
      const task = this.keyDict[data.id]
      if (task) {
        task.save(data.path)
      }
    })
  }
  private factory(project: ProjectEntity) {
    const id = project.id
    const task = this.data[id]
    if (!task) {
      const task = new BuildTaskService({
        project,
        bus: this.bus,
        output: this.output
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