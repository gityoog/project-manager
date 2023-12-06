import { Injectable, Logger } from "@nestjs/common"
import ProjectDeployTask from "./task"
import ProjectBus from "../../bus"
import ProjectService from "../../service"
import ProjectOutputService from "../../ouput/service"
import ProjectDeployBus from "../bus"

@Injectable()
export default class ProjectDeployService {
  private data: Record<string, Record<string, ProjectDeployTask>> = {}
  constructor(
    private projectBus: ProjectBus,
    private project: ProjectService,
    private logger: Logger,
    private output: ProjectOutputService,
    private bus: ProjectDeployBus
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

  private async factory({ project, process: id }: {
    project: string
    process: string
  }, create: boolean = false) {
    if (!this.data[project]) {
      this.data[project] = {}
    }
    if (!this.data[project][id]) {
      if (create) {
        const process = await this.project.process(project, id)
        if (!process || !process.deploy || !process.deploy.type) {
          return null
        }
        const task = this.data[project][id] = new ProjectDeployTask({
          bus: this.bus
        })
        task.setData(process)
      } else {
        return null
      }
    }
    return this.data[project][id]
  }

  async run({ project, process, output }: {
    project: string
    process: string
    output: string
  }) {
    const task = await this.factory({ project, process }, true)
    if (!task || task.isBusy()) return null
    const file = await this.output.read(output)
    if (!file || !file.content) {
      return null
    }
    return task.run({ data: file.data, content: file.content })
  }

  async stop({ project, process }: {
    project: string
    process: string
  }) {
    const task = await this.factory({ project, process })
    return task?.stop()
  }

  async info({
    project,
    process,
    output
  }: {
    project: string
    process: string
    output: string
  }) {
    const task = await this.factory({ project, process })
    return task?.info(output)
  }
}