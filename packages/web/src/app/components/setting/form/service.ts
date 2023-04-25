import AppApi from "@/app/api"
import LocaleService from "@/app/common/locale"
import Confirm from "@/common/comfirm"
import ElMessage from "@/common/element-ui/message"
import Status from "@/common/status"
import { Service, Already, Inject } from "ioc-di"
import { iSettingForm } from "."

@Service()
export default class ISettingForm implements iSettingForm {
  @Inject() private locale!: LocaleService

  status = new Status
  data = {
    shell: '',
    pty: '',
    lang: ''
  }
  langs: {
    name: string
    value: string
  }[] = []
  ptys: {
    name: string
    value: string
  }[] = []
  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.langs = this.locale.langs
    AppApi.config.ptys().success(data => {
      this.ptys = data
    })
    this.query()
  }

  private query() {
    this.data.lang = this.locale.lang
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
        this.locale.lang = this.data.lang
        ElMessage.success('保存成功')
      })
    )
  }
  clearOutput() {
    Confirm({
      title: '清空打包记录',
      message: '确定要清空所有打包记录和文件吗？',
      callback: ({ status, close }) => {
        status.use(
          AppApi.project.output.clear().success(() => {
            ElMessage.success('清空成功')
            close()
          })
        )
      }
    })
  }

  clearLog() {
    Confirm({
      title: '清空日志记录',
      message: '确定要清空所有日志记录吗？',
      callback: ({ status, close }) => {
        status.use(
          AppApi.logging.clear().success(() => {
            ElMessage.success('清空成功')
            close()
          })
        )
      }
    })
  }
}