import ProjectEntity from "@/module/project/service/entity"
import ProjectProcessBuildBus from "../../bus"
import ProjectOutputService from "@/module/project/ouput/service"
import BuildTaskStatus from "./status"
import { ClsServiceManager } from "nestjs-cls"
import LoggingService from "@/module/logging/service"
import NodeIpcService from "../../../node-ipc"
import PtyService from "@/common/pty"
import { Logger } from "@nestjs/common"
import { zipFolder } from "@/common/zip"

export default class BuildTaskService {
  private project: ProjectEntity
  key
  private pty
  private bus
  private status = new BuildTaskStatus()
  private output
  private clsStore
  private logging
  constructor({ project, bus, output, logging, ipc, logger }: {
    project: ProjectEntity,
    bus: ProjectProcessBuildBus,
    output: ProjectOutputService,
    logging: LoggingService,
    ipc: NodeIpcService,
    logger: Logger
  }) {
    this.project = project
    this.bus = bus
    this.logging = logging
    this.output = output
    this.key = `build_${project.id}`
    this.pty = new PtyService({
      env: ipc.env(this.key),
      onError: (name, err) => {
        logger.log(`${name} ${err.message}`, 'BuildTaskService')
      }
    })
    this.status.onChange(status => {
      this.bus.emit({ id: this.project.id, action: 'status', value: status })
    })
    this.pty.onStatsUpdate(stats => {
      this.bus.emit({
        id: this.project.id,
        action: 'stats',
        value: stats,
      })
    })
    this.pty.onStatusChange(status => {
      this.status.setPty(status)
    })
    this.pty.onStdoutPush(data => {
      this.bus.emit({
        id: this.project.id,
        action: 'stdout',
        value: data,
      })
    })
    this.clsStore = ClsServiceManager.getClsService().get()
  }

  save(outpath: string) {
    ClsServiceManager.getClsService().enterWith(this.clsStore)
    this.status.setZip(true)
    this.pty.tip('ziping', outpath)
    zipFolder(outpath).then(content => {
      this.status.setSave(true)
      this.pty.tip('saving')
      this.output.save({
        project: this.project.id,
        name: this.project.name,
        content
      }).then(() => {
        this.pty.tip('success')
      }).catch((e) => {
        this.pty.tip('fail', e instanceof Error ? e.message : 'unknown error')
      }).finally(() => {
        this.status.setSave(false)
      })
    }).catch(err => {
      this.pty.tip('zipfail', err.message)
    }).finally(() => {
      this.status.setZip(false)
    })
  }

  update(project: ProjectEntity) {
    this.project = project
  }

  info() {
    return {
      status: this.status.get(),
      pty: this.pty.info()
    }
  }

  run(shell: string, type: PtyService.Type) {
    if (!this.project.build) {
      return false
    }
    const pid = this.pty.run({
      shell,
      command: this.project.build,
      cwd: this.project.context,
      type
    })
    this.logging.save({
      target: 'BuildProcess',
      action: 'Run',
      description: `${this.project.name} ${type}: ${pid}`
    })
    return pid
  }

  stop() {
    if (this.status.canStop()) {
      this.logging.save({
        target: 'BuildProcess',
        action: 'Stop',
        description: `${this.project.name}`
      })
      return this.pty.stop()
    }
    return false
  }

  destroy() {
    this.pty.destroy()
    this.status.destroy()
    this.clsStore = null!
    this.bus = null!
    this.project = null!
    this.output = null!
  }
}