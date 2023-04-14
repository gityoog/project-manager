import AppApi from "@/app/api"
import Confirm from "@/common/comfirm"
import ElMessage from "@/common/element-ui/message"
import Status from "@/common/status"
import { Service, Already } from "ioc-di"
import { iSettingForm } from "."

@Service()
export default class ISettingForm implements iSettingForm {
  status = new Status
  data = {
    shell: ''
  }
  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.query()
  }

  private query() {
    this.status.use(
      AppApi.config.setting().success(data => {
        this.data.shell = data.shell
      })
    )
  }
  refresh() {
    this.query()
  }
  private saveShellStatus = new Status
  get saveShellLoading() {
    return this.saveShellStatus.loading
  }
  saveShell() {
    this.saveShellStatus.use(
      AppApi.config.saveShell({
        shell: this.data.shell
      }).success(() => {
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