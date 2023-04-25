import AppApi from "app/api"
import IElDialog from "@/components/el-dialog/service"
import ITableList from "@/components/table-list/service"
import TerminalService from "@/components/terminal/service"
import { Inject, Service } from "ioc-di"
import { iProjectBuilder } from "."
import AppWs from "@/app/ws"
import LocaleService from "@/app/common/locale"

type ws = ReturnType<typeof AppWs.process.build>

@Service()
export default class IProjectBuilder implements iProjectBuilder {
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
  terminal = new TerminalService({ fontSize: 12 })
  status = false
  table = new ITableList({
    api: () => AppApi.project.output.query({
      project: this.id
    }),
    page: false,
    params: {},
    init: false
  })
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
  open(id: string) {
    this.clear()
    this.id = id
    this.table.refresh()
    this.dialog.loading.use(
      AppApi.project.process.build.detail({
        id
      }).success(data => {
        if (data) {
          this.status = data.status
          this.terminal.write(data.stdout)
        } else {
          this.status = false
          this.terminal.clear()
        }
        this.ws = AppWs.process.build({
          namesapce: `/${id}`
        })
        this.ws.on('status', data => {
          this.status = data.value
        })
        this.ws.on('stdout', data => {
          this.terminal.write(data.value)
        })
        this.ws.on('new', () => {
          this.table.refresh()
        })
      })
    )
    this.dialog.open()
  }

  private clear() {
    this.terminal.write('\n')
    this.terminal.clear()
    if (this.ws) {
      this.ws.destroy()
      this.ws = undefined
    }
  }
}