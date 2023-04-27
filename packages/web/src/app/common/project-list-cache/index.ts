import IProjectList from "app/components/project-list/service"
import { Already, Concat, Inject, Service } from "ioc-di"
import AppBus from "../bus"

@Service()
export default class IProjectListCache {
  @Inject() private bus!: AppBus

  private other!: IProjectList

  private data: Record<string, IProjectList> = {}

  constructor() {
    this.init()
  }

  private otherActived = false

  get showOther() {
    return !this.other.isEmpty || this.otherActived
  }

  @Already
  private init() {
    this.other = Concat(this, new IProjectList(null))
    this.bus.onCategoryRemove(category => {
      const id = category.id
      if (this.data[id]) {
        this.data[id].destroy()
        delete this.data[id]
      }
    })
  }

  factory(data: Project.category | null) {
    if (!data) {
      this.otherActived = true
      return this.other
    }
    const id = data.id
    if (!this.data[id]) {
      this.data[id] = Concat(this, new IProjectList(id))
    }
    return this.data[id]
  }
}