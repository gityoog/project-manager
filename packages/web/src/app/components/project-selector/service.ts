import AppApi from "app/api"
import Confirm from "@/common/comfirm"
import { Destroy, Service } from "ioc-di"
import { iProjectSelector } from "."
import IProjectList from "../project-list/service"

@Service()
export default class IProjectSelector implements iProjectSelector {
  private list: IProjectList | null = null
  visible = false
  isAllChecked() {
    return this.list?.isAllChecked() ?? false
  }
  setList(list: IProjectList | null) {
    if (this.list !== list) {
      this.list = list
    }
  }
  remove() {
    const data = this.list?.getChecked() ?? []
    if (data.length > 0) {
      Confirm({
        title: '删除项目',
        message: `确定删除${data.length}个项目吗？`,
        callback: ({ status, close }) => {
          status.use(
            AppApi.project.manager.remove({
              ids: data.map(item => item.id)
            }).success(() => {
              close()
              this.toggle()
            })
          )
        }
      })
    }
  }
  toggle() {
    this.visible = !this.visible
  }
  toggleAll() {
    if (this.list) {
      this.list.allCheck(!this.isAllChecked())
    }
  }
  @Destroy
  destroy() {
    this.list = null
  }
}