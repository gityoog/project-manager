import AppApi from "@/app/api"
import LocaleService from "@/app/common/locale"
import Confirm from "@/common/comfirm"
import ElMessage from "@/common/element-ui/message"
import Status from "@/common/status"
import { Service, Already, Inject } from "ioc-di"
import { iServerSetting } from "."

@Service()
export default class IServerSetting implements iServerSetting {
  @Inject() locale!: LocaleService
  private get $t() {
    return this.locale.t.setting.server
  }
  status = new Status
  data = {
    shell: '',
    pty: ''
  }
  ptys: {
    name: string
    value: string
  }[] = []
  constructor() {
    this.init()
  }
  @Already
  private init() {
    AppApi.config.ptys().success(data => {
      this.ptys = data
    })
    this.query()
  }

  private query() {
    this.status.use(
      AppApi.config.setting().success(data => {
        this.data.shell = data.shell
        this.data.pty = data.pty
      })
    )
  }
  refresh() {
    this.query()
  }
  private saveStatus = new Status
  get saveLoading() {
    return this.saveStatus.loading
  }
  save() {
    this.saveStatus.use(
      AppApi.config.save({
        shell: this.data.shell,
        pty: this.data.pty
      }).success(() => {
        ElMessage.success(this.$t.saveSuccess)
      })
    )
  }
  clearOutput() {
    Confirm({
      title: this.$t.clearOutputTitle,
      message: this.$t.clearOutputMessage,
      callback: ({ status, close }) => {
        status.use(
          AppApi.project.output.clear().success(() => {
            ElMessage.success(this.$t.clearOutputSuccess)
            close()
          })
        )
      }
    })
  }

  clearLog() {
    Confirm({
      title: this.$t.clearLogTitle,
      message: this.$t.clearLogMessage,
      callback: ({ status, close }) => {
        status.use(
          AppApi.logging.clear().success(() => {
            ElMessage.success(this.$t.clearLogSuccess)
            close()
          })
        )
      }
    })
  }
}