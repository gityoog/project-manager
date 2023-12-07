import IElDialog from "@/components/el-dialog/service"
import { Already, Concat, Destroy, Inject, Service } from "ioc-di"
import { iProjectDetail } from "."
import LocaleService from "@/app/common/locale"
import AppApi from "@/app/api"
import IProjectDetailItem from "./item/service"


@Service()
export default class IProjectDetail implements iProjectDetail {
  @Inject() locale!: LocaleService
  data: IProjectDetailItem[] = []
  private get $t() {
    return this.locale.t.project.detail
  }
  private id: string = ''
  dialog = new IElDialog({
    onClose: () => {
      this.clear()
    },
    footer: false
  })

  constructor() {
    this.init()
  }
  private destroyCallbacks: Array<() => void> = []

  @Already
  private init() {

  }
  private _actived = ''
  get actived() {
    return this._actived
  }
  set actived(value) {
    this._actived = value
    const index = Number(value)
    if (this.data[index]) {
      this.data[index].active()
    }
  }
  open(id: string) {
    this.clear()
    this.id = id
    this.dialog.loading.use(
      AppApi.project.manager.detail({
        id: this.id
      })
        .abort(() => this.id !== id)
        .success(data => {
          const result = data.filter(({ main }) => !main).concat(data.filter(({ main }) => main))
          this.data = result.map(({ process, info, main, deploy }) => Concat(this, new IProjectDetailItem(id, { process, info, main, deploy })))
          this.actived = '0'
        })
    )
    this.dialog.open()
  }
  active(index: number) {
    this.data[index]?.active()
  }
  private clear() {
    this.data.forEach(item => item.destroy())
    this.data = []
  }
  @Destroy
  destroy() {
    this.destroyCallbacks.forEach(fn => fn())
    this.destroyCallbacks = []
  }
}