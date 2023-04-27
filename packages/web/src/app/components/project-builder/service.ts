import AppApi from "app/api"
import IElDialog from "@/components/el-dialog/service"
import ITableList from "@/components/table-list/service"
import TerminalService from "@/components/terminal/service"
import { Already, Destroy, Inject, Service } from "ioc-di"
import { iProjectBuilder } from "."
import AppWs from "@/app/ws"
import LocaleService from "@/app/common/locale"
import AppConfig from "@/app/common/config"

type ws = ReturnType<typeof AppWs.process.build>

@Service()
export default class IProjectBuilder implements iProjectBuilder {
  @Inject() private config!: AppConfig
  @Inject() locale!: LocaleService
  private get $t() {
    return this.locale.t.project.build
  }
  private id: string = ''
  dialog = new IElDialog({
    onClose: () => {
      this.clear()
    }
  })
  expanded = false
  terminal: TerminalService | null = null
  status = false
  stats: {
    cpu: string
    memory: string
  } | null = null
  table = new ITableList({
    api: () => AppApi.project.output.query({
      project: this.id
    }),
    page: false,
    params: {},
    init: false
  })
  constructor() {
    this.init()
  }
  private destroyCallbacks: Array<() => void> = []
  @Already
  private init() {
    this.destroyCallbacks.push(
      this.config.watch('terminal', value => {
        this.terminal?.setOption('fontSize', value.fontSize)
        this.terminal?.setOption('fontFamily', value.fontFamily)
        this.terminal?.reload()
      })
    )
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
  toggleStatus() {
    if (this.status) {
      AppApi.project.process.build.stop({
        id: this.id
      }).validate(value => value ? true : this.$t.tip.stopFail)
        .success(() => {
          this.status = false
        })
    } else {
      AppApi.project.process.build.start({
        id: this.id
      }).validate(value => value ? true : this.$t.tip.runFail)
        .success(() => {
          this.status = true
        })
    }
  }
  private ws?: ws
  private factoryTerminal() {
    if (!this.terminal) {
      const options = this.config.terminal
      this.terminal = new TerminalService({
        fontSize: options.fontSize,
        fontFamily: options.fontFamily
      })
    }
    return this.terminal
  }
  open(id: string) {
    this.clear()
    this.id = id
    this.table.refresh()
    this.stats = null
    this.dialog.loading.use(
      AppApi.project.process.build.detail({
        id
      }).success(data => {
        const terminal = this.factoryTerminal()
        if (data) {
          this.status = data.status
          this.stats = data.pty.stats
          terminal.write(data.pty.stdout)
        } else {
          this.status = false
          this.stats = null
          terminal.clear()
        }
        this.ws = AppWs.process.build({
          namesapce: `/${id}`
        })
        this.ws.on('status', data => {
          this.status = data.value
        })
        this.ws.on('stdout', data => {
          terminal.write(data.value)
        })
        this.ws.on('new', () => {
          this.table.refresh()
        })
        this.ws.on('stats', data => {
          this.stats = data.value
        })
      })
    )
    this.dialog.open()
  }

  private clear() {
    this.terminal?.write('\n')
    this.terminal?.clear()
    if (this.ws) {
      this.ws.destroy()
      this.ws = undefined
    }
  }
  @Destroy
  destroy() {
    this.destroyCallbacks.forEach(fn => fn())
    this.destroyCallbacks = []
  }
}