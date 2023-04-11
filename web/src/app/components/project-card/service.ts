import { Already, Container, Destroy, Inject, Service } from "ioc-di"
import { iProjectCard } from "."
import TerminalService from "components/terminal/service"
import IProjectEditor from "../project-editor/service"
import IProjectSelector from "../project-selector/service"
import AppWs from "app/ws"
import AppApi from "app/api"
import ElMessage from "@/common/element-ui/message"
import IProjectBuilder from "../project-builder/service"

@Container()
@Service()
export default class IProjectCard implements iProjectCard {
  @Inject() private editor!: IProjectEditor
  @Inject() private selector!: IProjectSelector
  @Inject() private builder!: IProjectBuilder
  private ws
  private data: Project.data
  id: string
  cpuUsage = ''
  memoryUsage = ''
  status = false
  url = ''
  terminal = new TerminalService({
    fontSize: 12
  })
  time = 0
  get name() {
    return this.data.name
  }
  get sort() {
    return this.data.sort
  }
  constructor(data: Project.data) {
    this.id = data.id
    this.data = { ...data }
    this.ws = AppWs.process.dev({
      namesapce: `/${this.id}`
    })
    this.init()
  }

  @Already
  private init() {
    AppApi.project.process.dev.detail({
      id: this.id
    }).success(data => {
      if (data) {
        this.status = data.pty.status
        this.terminal.write(data.pty.stdout)
        this.updateStats(data.pty.stats)
        this.updateUrl(data.url)
      }
    }).final(() => {
      this.ws.on('status', data => {
        this.updateStatus(data.value)
      })
      this.ws.on('stdout', data => {
        this.terminal.write(data.value)
      })
      this.ws.on('stats', data => {
        this.updateStats(data.value)
      })
      this.ws.on('url', data => {
        this.updateUrl(data.value)
      })
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
    }
  }

  get showCheck() {
    return this.selector.visible
  }
  checked = false
  toggleCheck() {
    this.checked = !this.checked
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
        ElMessage.warning(`启动失败`)
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
  @Destroy
  destroy() {
    this.ws.destroy()
  }
}