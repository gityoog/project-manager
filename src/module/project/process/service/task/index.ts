import PtyService from "@/common/pty"
import NodeIpcService from "../../node-ipc"
import { Logger } from "@nestjs/common"
import ConfigService from "../../../../config/service"
import TaskStatus from "./status"
import { ClsServiceManager } from "nestjs-cls"
import { zipFolder } from "@/common/zip"
import ProjectProcessBus from "../../bus"
import ProjectOutputService from "../../../ouput/service"

type data = {
  id: string
  name: string
  context: string
  command: string
  encoding?: string
  env?: Record<string, string>
}
type project = { id: string, name: string }

export default class ProjectProcessTaskService {
  private id
  private project
  private key
  private pty
  private data
  private config
  private ipc
  private clsStore
  private output
  private bus
  private pid: number | null = null
  private status = new TaskStatus
  private url: {
    host: string
    port: string
  } | null = null
  constructor({ project, data, ipc, logger, config, output, bus }: { project: project, data: data, ipc: NodeIpcService, logger: Logger, config: ConfigService, output: ProjectOutputService, bus: ProjectProcessBus }) {
    this.id = data.id
    this.data = data
    this.project = { ...project }
    this.key = `task_${data.id}`
    this.config = config
    this.ipc = ipc
    this.output = output
    this.bus = bus
    this.pty = new PtyService({
      env: this.ipc.env(this.key),
      onError: (name, err) => {
        logger.log(`${name} ${err.message}`, 'ProjectProcessTaskService')
        this.pty.tip('fail', err.message)
      }
    })
    this.clsStore = ClsServiceManager.getClsService().get()
    this.bind()
  }

  private onUrl = (data: { id: string, host: string, port: string }) => {
    if (data.id === this.key) {
      this.url = {
        host: data.host,
        port: data.port
      }
      this.bus.emit({
        id: this.id,
        project: this.project.id,
        action: 'url',
        value: this.url
      })
    }
  }
  private onDist = (data: { id: string, path: string }) => {
    if (data.id === this.key) {
      this.saveFile(data.path)
    }
  }
  private onStdin = (data: string) => {
    this.pty.write(data)
  }
  private bind() {
    this.bus.onStdin(this.id, this.onStdin)
    this.ipc.on('url', this.onUrl)
    this.ipc.on('dist', this.onDist)
    this.pty.onStatusChange(status => {
      this.status.setPty(status)
    })
    this.pty.onStdoutPush(data => {
      this.bus.emit({
        project: this.project.id,
        id: this.id,
        action: 'stdout',
        value: data,
      })
    })
    this.pty.onStatsUpdate(stats => {
      this.bus.emit({
        id: this.id,
        project: this.project.id,
        action: 'stats',
        value: stats,
      })
    })
    this.status.onChange(status => {
      this.bus.emit({ id: this.id, project: this.project.id, action: 'status', value: status })
    })
  }
  private unbind() {
    this.bus.offStdin(this.id, this.onStdin)
    this.ipc.off('url', this.onUrl)
    this.ipc.off('dist', this.onDist)
    this.pty.destroy()
  }
  setProject(project: project) {
    this.project = { ...project }
  }
  setData(data: data) {
    this.data = data
  }
  private saveFile(outpath: string) {
    ClsServiceManager.getClsService().enterWith(this.clsStore)
    this.status.setZip(true)
    this.pty.tip('ziping', outpath)
    zipFolder(outpath, {
      type: 'nodebuffer',
      compression: 'DEFLATE'
    }).then(content => {
      this.status.setSave(true)
      this.pty.tip('saving')
      this.output.save({
        project: this.project.id,
        process: this.data.id,
        name: this.project.name + '_' + (this.data.name || 'default'),
        content
      }).then(() => {
        this.pty.tip('success')
        this.bus.emit({
          id: this.id,
          project: this.project.id,
          action: 'file'
        })
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
  async run() {
    if (!this.status.get()) {
      this.url = null
      this.pid = this.pty.run({
        shell: await this.config.getShell(),
        command: this.data.command,
        cwd: this.data.context,
        type: await this.config.getPty(),
        env: this.data.env,
        encoding: this.data.encoding
      }) || null
    }
    return this.pid
  }

  async stop() {
    if (this.status.canStop()) {
      this.pty.stop()
      this.pid = null
      this.url = null
      return true
    }
    return false
  }

  async info() {
    return {
      status: this.status.get(),
      pty: this.pty.info(),
      url: this.url,
    }
  }
  destroy() {
    this.unbind()
    this.pty = null!
    this.data = null!
    this.project = null!
    this.config = null!
    this.ipc = null!
    this.pid = null!
    this.status = null!
    this.url = null!
    this.clsStore = null!
    this.output = null!
  }
}