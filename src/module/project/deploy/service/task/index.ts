import DeployBasic from "@/common/deploy/basic"
import ProjectDeployBus from "../../bus"
import DeployService from "@/common/deploy"
import ProjectDeployTaskStatus from "./status"
import ProjectOutputEntity from "@/module/project/ouput/service/entity"

export default class ProjectDeployTask {
  private status = new ProjectDeployTaskStatus()
  private process!: App.Project.Process.Config
  private bus
  private deploy: {
    type: string
    service: DeployBasic
  } | null = null

  constructor({ bus }: {
    bus: ProjectDeployBus
  }) {
    this.bus = bus
    this.status.on((data) => {
      this.bus.emit({
        type: data.type,
        process: this.process.id,
        actived: data.actived,
        msg: data.msg,
      })
    })
  }
  setData(data: App.Project.Process.Config) {
    this.process = data
    if (this.deploy && this.process.deploy) {
      if (this.deploy.type === this.process.deploy.type) {
        this.deploy.service.setOptions(this.process.deploy.data)
      }
    }
  }
  private factory() {
    if (this.process.deploy && this.process.deploy.type) {
      const type = this.process.deploy.type
      if (!this.deploy || this.deploy.type !== type) {
        this.deploy?.service.destroy()
        const service = DeployService.factory(type)
        if (!service) {
          return null
        }
        this.deploy = { type, service }
        this.deploy.service.setOptions(this.process.deploy.data)
        this.deploy.service.on({
          start: () => {
            this.status.start()
          },
          success: (msg) => {
            this.status.success(msg)
          },
          fail: (msg) => {
            this.status.fail(msg)
          },
          progress: (msg) => {
            this.status.progress(msg)
          }
        })
      }
      return this.deploy?.service || null
    }
    return null
  }
  async run({ data, content }: {
    data: ProjectOutputEntity
    content: Buffer
  }) {
    if (!this.isBusy()) {
      const task = this.factory()
      if (task) {
        this.status.active(data.id)
        return task.run(content, data)
      }
    }
    return null
  }
  async stop() {
    return this.deploy?.service.stop()
  }
  isBusy() {
    return this.status.isBusy()
  }
  info() {
    return this.status.info()
  }
  destroy() {
    this.deploy?.service.destroy()
    this.status.destroy()
    this.deploy = null!
    this.bus = null!
    this.status = null!
  }
}