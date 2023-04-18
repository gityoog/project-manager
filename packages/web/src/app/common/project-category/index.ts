import AppApi from "app/api"
import SCallback from "@/common/scallback"
import { Already, Destroy, Inject, Service } from "ioc-di"
import WRequest from "wrequest"
import AppBus from "../bus"

type data = Project.category

@Service()
export default class ProjectCategoryService {
  @Inject() private bus!: AppBus
  private callabck = new SCallback
  data: data[] = []
  other = false
  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.bus.onCategoryChange(() => {
      this.change()
    })
  }
  private inited = false
  private wrequest?: WRequest<{
    data: data[]
    other: boolean
  }>
  private update() {
    this.inited = true
    this.wrequest = AppApi.project.category.query()
      .success(({ data, other }) => {
        this.data = data
        this.other = other
      }).final(() => {
        this.wrequest = undefined
      })
  }
  getData() {
    if (!this.inited) {
      this.update()
    }
    if (this.wrequest) {
      return this.wrequest
    } else {
      return new WRequest(() => Promise.resolve({
        data: this.data,
        other: this.other
      }))
    }
  }
  private change() {
    this.update()
    this.callabck.fire()
  }
  onChange(callabck: () => void, emit = true) {
    const clearFn = this.callabck.bind(callabck)
    if (emit) {
      callabck()
    }
    return clearFn
  }

  @Destroy
  destroy() {
    this.callabck.destory()
    this.wrequest?.destroy()
  }
}