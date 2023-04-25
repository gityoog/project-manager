import ProjectEntity from "@/module/project/service/entity"
import ProjectProcessDevBus from "../../bus"
import LoggingService from "@/module/logging/service"
import NodeIpcService from "../../../node-ipc"
import PtyService from "@/common/pty"
import { Logger } from "@nestjs/common"

type url = {
  host: string
  port: string
} | null

export default class DevTaskService {
  private project: ProjectEntity
  key
  private pty
  private url: url = null
  private bus
  private logging
  constructor({ project, bus, logging, ipc, logger }: {
    project: ProjectEntity,
    bus: ProjectProcessDevBus,
    logging: LoggingService,
    ipc: NodeIpcService,
    logger: Logger
  }) {
    this.project = project
    this.bus = bus
    this.logging = logging
    this.key = `dev_${project.id}`
    this.pty = new PtyService({
      env: ipc.env(this.key),
      onError: (name, err) => {
        logger.log(`${name} ${err.message}`, 'DevTaskService')
      }
    })

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

  update(project: ProjectEntity) {
    this.project = project
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
    const pid = this.pty.run({
      shell,
      command: this.project.dev,
      cwd: this.project.context
    })
    this.logging.save({
      target: 'DevProcess',
      action: 'Run',
      description: `${this.project.name}: ${pid}`
    })
    return pid
  }

  stop() {
    this.setUrl(null)
    this.logging.save({
      target: 'DevProcess',
      action: 'Stop',
      description: `${this.project.name}`
    })
    return this.pty.stop()
  }

  destroy() {
    this.pty.destroy()
    this.bus = null!
    this.project = null!
  }
}