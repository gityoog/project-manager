import IProjectList from "app/components/project-list/service"
import { Already, Concat, Inject, Service } from "ioc-di"
import AppBus from "../bus"

@Service()
export default class IProjectListCache {
  @Inject() private bus!: AppBus

  private uncategorized!: IProjectList

  private data: Record<string, IProjectList> = {}

  constructor() {
    this.init()
  }

  private uncategorizedActive = false

  get showUncategorized() {
    return !this.uncategorized.isEmpty || this.uncategorizedActive
  }

  @Already
  private init() {
    this.uncategorized = Concat(this, new IProjectList(null))
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
      this.uncategorizedActive = true
      return this.uncategorized
    }
    const id = data.id
    if (!this.data[id]) {
      this.data[id] = Concat(this, new IProjectList(id))
    }
    return this.data[id]
  }
}