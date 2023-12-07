import TerminalService from "@/components/terminal/service"
import { iProjectDetailItem } from "."
import { Already, Container, Destroy, Inject, Service } from "ioc-di"
import LocalStorageItem from "@/common/local-storage-item"
import ITableList from "@/components/table-list/service"
import AppApi from "@/app/api"
import LocaleService from "@/app/common/locale"
import AppWs from "@/app/ws"
import AppConfig from "@/app/common/config"
import ProjectDeploy from "./deploy"
import { Notification } from "element-ui"

type info = {
  pty: {
    stats: {
      cpu: string
      memory: string
    } | null
    stdout: string[]
  }
  status: boolean
} | null

@Container()
@Service()
export default class IProjectDetailItem implements iProjectDetailItem {
  @Inject() locale!: LocaleService
  @Inject() private config!: AppConfig
  name
  terminal
  height: number | null
  status = false
  stats: {
    cpu: string
    memory: string
  } | null = null
  toggleLoading = false
  get deployEnabled() {
    return this.deploy.enabled
  }
  table = new ITableList({
    api: () => AppApi.project.output.query({
      project: this.project,
      process: this.main ? undefined : this.process
    }),
    page: false,
    params: {},
    init: false
  })

  private ws
  private heightValue
  private process
  private stdout
  private deploy
  private main
  constructor(private project: string, options: {
    process: Project.process,
    info: info
    main?: true
    deploy: Project.Deploy.status
  }) {
    this.main = options.main === true
    this.process = options.process.id
    if (!this.main) {
      this.name = options.process.name
      this.heightValue = new LocalStorageItem<number | null>({
        key: 'IProjectDetailItemHeight' + '_' + options.process.id,
        default: 65
      })
      this.height = this.heightValue.bind(this, 'height')
      this.terminal = new TerminalService
      this.ws = AppWs.process({
        namesapce: `/${options.process.id}`,
      })
      this.stats = options.info?.pty.stats || null
      this.status = options.info?.status || false
      if (options.info?.pty.stdout.length) {
        this.stdout = options.info.pty.stdout
      }
    } else {
      this.name = ''
      this.height = null
      this.terminal = null
    }
    this.deploy = new ProjectDeploy({
      project: project,
      process: options.process,
      status: options.deploy
    })
    this.init()
  }
  private destroyCallbacks: Array<() => void> = []
  ready = false

  @Already
  private init() {
    if (this.main) {
      this.name = this.locale.t.project.detail.other
    }
  }

  active() {
    this.terminal?.focus()
    if (this.ready) return
    this.ready = true
    if (this.terminal) {
      this.destroyCallbacks.push(
        this.config.watch('terminal', value => {
          this.terminal!.setOption('fontSize', value.fontSize)
          this.terminal!.setOption('fontFamily', value.fontFamily)
          this.terminal!.reload()
        }, true)
      )
      if (this.stdout) {
        this.terminal.write(this.stdout)
      }
    }
    if (this.ws) {
      this.ws.on('status', ({ value }) => {
        this.status = value
      })
      this.ws.on('stdout', ({ value }) => {
        this.terminal!.write(value)
      })
      this.ws.on('stats', data => {
        this.stats = data.value
      })
      this.ws.on('file', () => {
        this.table.refresh()
      })
      this.ws.on('deploy', data => {
        this.deploy.update(data)

        if (data?.type === 'failed') {
          Notification.warning({
            title: this.locale.t.project.detail.output.deploy.tip.failed,
            message: data.msg
          })
        } else if (data?.type === 'success') {
          Notification.success({
            title: this.locale.t.project.detail.output.deploy.tip.successfull,
            message: this.locale.t.project.detail.output.deploy.tip.successfull
          })
        }
      })
    }
    this.table.refresh()
  }
  toggleStatus() {
    const action = this.status ? AppApi.project.process.stop : AppApi.project.process.start
    action({
      project: this.project,
      id: this.process
    }).load(() => this.toggleLoading = true)
      .final(() => this.toggleLoading = false)
  }
  download(index: number) {
    const row = this.table.getRow(index)
    window.open(
      AppApi.project.output.download({ id: row.id })
    )
  }
  remove(index: number) {
    this.table.remove(index, data => AppApi.project.output.remove({ id: data.id }))
  }
  startDeploy(index: number) {
    const row = this.table.getRow(index)
    this.deploy.start(row.id)
  }
  stopDeploy(index: number) {
    this.deploy.stop()
  }
  hasDeploy(index: number) {
    const row = this.table.getRow(index)
    if (this.process === row.process) {
      return true
    }
    return false
  }
  deployStatus(index: number) {
    const row = this.table.getRow(index)
    if (this.process === row.process) {
      return this.deploy.getStatus(row.id)
    }
    return null
  }
  @Destroy
  destroy() {
    this.destroyCallbacks.forEach(callback => callback())
    this.destroyCallbacks = undefined!
    this.ws?.destroy()
    this.deploy.destroy()
    this.deploy = undefined!
    this.ws = undefined!
    this.terminal?.destroy()
    this.terminal = undefined!
    this.heightValue?.destroy()
    this.heightValue = undefined!
  }
}