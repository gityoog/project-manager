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
          this.data = data?.map(({ process, info }) => Concat(this, new IProjectDetailItem(id, { process, info }))) || []
          this.data.push(Concat(this, new IProjectDetailItem(id)))
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