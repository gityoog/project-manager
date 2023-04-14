import ProjectEntity from "@/module/project/service/entity"
import NodePtyService from "@/common/node-pty"
import ProjectProcessBuildBus from "../../bus"
import zipper from "zip-local"
import ProjectOutputService from "@/module/project/ouput/service"
import BuildTaskStatus from "./status"
import { ClsServiceManager } from "nestjs-cls"
import LoggingService from "@/module/logging/service"

export default class BuildTaskService {
  private project: ProjectEntity
  key
  private pty
  private bus
  private status = new BuildTaskStatus()
  private output
  private clsStore
  private logging
  constructor({ project, bus, output, logging }: {
    project: ProjectEntity,
    bus: ProjectProcessBuildBus,
    output: ProjectOutputService,
    logging: LoggingService
  }) {
    this.project = project
    this.bus = bus
    this.logging = logging
    this.output = output
    this.key = `build_${project.id}`
    this.pty = new NodePtyService(this.key, { stats: false })

    this.status.onChange(status => {
      this.bus.emit({ id: this.project.id, action: 'status', value: status })
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
    zipper.zip(outpath, (err, zipped) => {
      this.status.setZip(false)
      if (err) {
        return this.pty.tip('zipfail', err.message)
      }
      this.pty.tip('saving')
      this.status.setSave(true)
      this.output.save({
        project: this.project.id,
        name: this.project.name,
        content: zipped.memory()
      }).then(() => {
        this.pty.tip('success')
      }).catch((e) => {
        this.pty.tip('fail', e instanceof Error ? e.message : 'unknown error')
      }).finally(() => {
        this.status.setSave(false)
      })
    })
  }

  info() {
    return {
      status: this.status.get(),
      stdout: this.pty.info().stdout
    }
  }

  run(shell: string) {
    if (!this.project.build) {
      return false
    }
    const pid = this.pty.run({
      shell,
      command: this.project.build,
      cwd: this.project.context,
    })
    this.logging.save({
      target: 'BuildProcess',
      action: 'Run',
      description: `${this.project.name}: ${pid}`
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