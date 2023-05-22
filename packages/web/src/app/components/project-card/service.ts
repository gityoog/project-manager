import { Already, Container, Destroy, Inject, Service } from "ioc-di"
import { iProjectCard } from "."
import TerminalService from "components/terminal/service"
import IProjectEditor from "../project-editor/service"
import IProjectSelector from "../project-selector/service"
import AppWs from "app/ws"
import AppApi from "app/api"
import ElMessage from "@/common/element-ui/message"
import IProjectBuilder from "../project-builder/service"
import LocaleService from "@/app/common/locale"
import LocalStorageItem from "@/common/local-storage-item"
import AppConfig from "@/app/common/config"

type devInfo = {
  pty: {
    status: boolean
    stdout: string[]
    stats: {
      cpu: string
      memory: string
    } | null
  }
  url: {
    host: string
    port: string
  } | null
} | null

@Container()
@Service()
export default class IProjectCard implements iProjectCard {
  @Inject() private editor!: IProjectEditor
  @Inject() private selector!: IProjectSelector
  @Inject() private builder!: IProjectBuilder
  @Inject() private config!: AppConfig
  @Inject() locale!: LocaleService
  private destroyCallbacks: Array<() => void> = []

  private get $t() {
    return this.locale.t.project.card
  }
  private ws
  private data: Project.data
  id: string
  cpuUsage = ''
  memoryUsage = ''
  status = false
  showTerminal = false
  url = ''
  terminal: TerminalService | null = null
  time = 0
  get name() {
    return this.data.name
  }
  get sort() {
    return this.data.sort
  }
  height: number
  private heightValue
  constructor(data: Project.data) {
    this.id = data.id
    this.heightValue = new LocalStorageItem({
      key: 'ProjectCardHeight' + '_' + this.id,
      default: 120
    })
    this.height = this.heightValue.bind(this, 'height')
    this.data = { ...data }
    this.ws = AppWs.process.dev({
      namesapce: `/${this.id}`
    })
    this.init()
  }

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

  @Already
  private init() {
    this.destroyCallbacks.push(
      this.config.watch('terminal', value => {
        this.terminal?.setOption('fontSize', value.fontSize)
        this.terminal?.setOption('fontFamily', value.fontFamily)
        this.terminal?.reload()
      })
    )

    this.ws.on('status', data => {
      this.updateStatus(data.value)
    })
    this.ws.on('stdout', data => {
      this.factoryTerminal().write(data.value)
    })
    this.ws.on('stats', data => {
      this.updateStats(data.value)
    })
    this.ws.on('url', data => {
      this.updateUrl(data.value)
    })
  }

  private updateStats(data: { cpu: string, memory: string } | null) {
    if (!data) {
      this.cpuUsage = ''
      this.memoryUsage = ''
    } else {
      this.cpuUsage = data.cpu
      this.memoryUsage = data.memory
    }
  }
  private updateUrl(data: { host: string, port: string } | null) {
    if (!data) {
      this.url = ''
    } else {
      this.url = `${data.host === '0.0.0.0' ? location.hostname : data.host}:${data.port}`
    }
  }
  private updateStatus(value: boolean) {
    if (this.status !== value) {
      this.status = value
      this.time = Date.now()
      if (this.status) {
        this.showTerminal = false
      }
    }
  }
  toggleTerminal() {
    if (!this.status) {
      this.showTerminal = !this.showTerminal
    }
  }
  get showCheck() {
    return this.selector.visible
  }
  checked = false
  toggleCheck() {
    this.checked = !this.checked
  }
  setInfo(data: devInfo) {
    if (data) {
      this.status = data.pty.status
      if (this.status) {
        this.factoryTerminal().write(data.pty.stdout)
      }
      this.updateStats(data.pty.stats)
      this.updateUrl(data.url)
    }
  }
  update(data: Project.data) {
    this.data = { ...data }
  }
  stop() {
    AppApi.project.process.dev.stop({
      id: this.id
    }).success(() => {
      this.updateStatus(false)
    })
  }
  run() {
    AppApi.project.process.dev.start({
      id: this.id
    }).validate(data => data !== false)
      .fail(err => {
        ElMessage.warning(this.$t.runFail)
      })
      .success(() => {
        this.updateStatus(true)
      })
  }
  edit() {
    this.editor.open(this.data)
  }
  build() {
    this.builder.open(this.id)
  }
  open() {
    window.open('//' + this.url)
  }
  remove() {
    this.heightValue.clear()
  }
  @Destroy
  destroy() {
    this.destroyCallbacks.forEach(fn => fn())
    this.destroyCallbacks = []
    this.heightValue.destroy()
    this.ws.destroy()
  }
}