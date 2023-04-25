import AppApi from "app/api"
import Confirm from "@/common/comfirm"
import { Destroy, Inject, Service } from "ioc-di"
import { iProjectSelector } from "."
import IProjectList from "../project-list/service"
import LocaleService from "@/app/common/locale"

@Service()
export default class IProjectSelector implements iProjectSelector {
  @Inject() private locale!: LocaleService
  private get $t() {
    return this.locale.t.selector
  }
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
        title: this.$t.confirm.title,
        message: this.$t.confirm.message(data.length),
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