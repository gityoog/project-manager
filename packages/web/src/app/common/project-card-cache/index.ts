import IProjectCard from "app/components/project-card/service"
import { Already, Concat, Inject, Service } from "ioc-di"
import AppBus from "../bus"

@Service()
export default class IProjectCardCache {
  @Inject() private bus!: AppBus

  private data: Record<string, IProjectCard> = {}

  constructor() {
    this.init()
  }

  @Already
  private init() {
    this.bus.onProjectRemove(project => {
      const id = project.id
      if (this.data[id]) {
        this.data[id].destroy()
        delete this.data[id]
      }
    })
    this.bus.onProjectUpdate(project => {
      const id = project.id
      if (this.data[id]) {
        this.data[id].update(project)
      }
    })
  }

  factory(project: Project.data) {
    if (!this.data[project.id]) {
      this.data[project.id] = Concat(this, new IProjectCard(project))
    } else {
      this.data[project.id].update(project)
    }
    return this.data[project.id]
  }
}