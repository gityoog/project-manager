import TerminalService from "@/components/terminal/service"
import { iProjectDetailItem } from "."
import { Already, Container, Destroy, Inject, Service } from "ioc-di"
import LocalStorageItem from "@/common/local-storage-item"
import ITableList from "@/components/table-list/service"
import AppApi from "@/app/api"
import LocaleService from "@/app/common/locale"
import AppWs from "@/app/ws"
import AppConfig from "@/app/common/config"

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
  table = new ITableList({
    api: () => AppApi.project.output.query({
      project: this.project,
      process: this.id
    }),
    page: false,
    params: {},
    init: false
  })

  private ws
  private heightValue
  private id
  private stdout
  constructor(private project: string, options?: {
    process: Project.process,
    info: info
  }) {
    if (options?.process) {
      this.id = options.process.id
      this.name = options.process.name
      this.heightValue = new LocalStorageItem<number | null>({
        key: 'IProjectDetailItemHeight' + '_' + this.id,
        default: 65
      })
      this.height = this.heightValue.bind(this, 'height')
      this.terminal = new TerminalService
      this.ws = AppWs.process({
        namesapce: `/${this.id}`,
      })
      this.stats = options.info?.pty.stats || null
      this.status = options.info?.status || false
      if (options.info?.pty.stdout.length) {
        this.stdout = options.info.pty.stdout
      }
    } else {
      this.id = undefined
      this.name = ''
      this.height = null
      this.terminal = null
    }
    this.init()
  }
  private destroyCallbacks: Array<() => void> = []
  ready = false

  @Already
  private init() {
    if (!this.id) {
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
    }
    this.table.refresh()
  }
  toggleStatus() {
    const action = this.status ? AppApi.project.process.stop : AppApi.project.process.start
    action({
      project: this.project,
      id: this.id
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
  @Destroy
  destroy() {
    this.destroyCallbacks.forEach(callback => callback())
    this.destroyCallbacks = undefined!
    this.ws?.destroy()
    this.ws = undefined!
    this.terminal?.destroy()
    this.terminal = undefined!
    this.heightValue?.destroy()
    this.heightValue = undefined!
  }
}