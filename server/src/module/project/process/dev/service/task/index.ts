import ProjectEntity from "@/module/project/service/entity"
import NodePtyService from "@/common/node-pty"
import ProjectProcessDevBus from "../../bus"

type url = {
  host: string
  port: string
} | null

export default class DevTaskService {
  private project: ProjectEntity
  key
  private pty
  private url: url = null
  private bus: ProjectProcessDevBus
  constructor({ project, bus }: {
    project: ProjectEntity,
    bus: ProjectProcessDevBus
  }) {
    this.project = project
    this.bus = bus
    this.key = `dev_${project.id}`
    this.pty = new NodePtyService(this.key)

    this.pty.onStatusChange(status => {
      this.bus.emit({
        id: this.project.id,
        action: 'status',
        value: status,
      })
    })
    this.pty.onStdoutPush(data => {
      this.bus.emit({
        id: this.project.id,
        action: 'stdout',
        value: data,
      })
    })
    this.pty.onStatsUpdate(stats => {
      this.bus.emit({
        id: this.project.id,
        action: 'stats',
        value: stats,
      })
    })
  }

  setUrl(url: url) {
    if (this.url !== url) {
      this.url = url
      this.bus.emit({
        id: this.project.id,
        action: 'url',
        value: url,
      })
    }
  }

  info() {
    return {
      pty: this.pty.info(),
      url: this.url
    }
  }

  run(shell: string) {
    if (!this.project.dev) {
      return false
    }
    return this.pty.run({
      shell,
      command: this.project.dev,
      cwd: this.project.context,
    })
  }

  stop() {
    this.setUrl(null)
    return this.pty.stop()
  }

  destroy() {
    this.pty.destroy()
    this.bus = null!
    this.project = null!
  }
}