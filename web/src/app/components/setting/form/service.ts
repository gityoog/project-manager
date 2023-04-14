import AppApi from "@/app/api"
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
    ElMessage.warning('暂未实现')
  }

  clearLog() {
    ElMessage.warning('暂未实现')
  }
}