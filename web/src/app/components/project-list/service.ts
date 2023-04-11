import AppApi from "app/api"
import Status from "@/common/status"
import { Already, Destroy, Inject, Service } from "ioc-di"
import { iProjectList } from '.'
import IProjectCard from "../project-card/service"
import IProjectCardCache from "app/common/project-card-cache"
import AppBus from "app/common/bus"

@Service()
export default class IProjectList implements iProjectList {
  @Inject() private cache!: IProjectCardCache
  @Inject() private bus!: AppBus
  private data: IProjectCard[] = []
  private off: (() => void)[] = []
  private type: string | null
  key
  status = new Status
  constructor(type: string | null) {
    this.key = `ProjectList_key_${type}`
    this.type = type
    this.init()
  }
  @Already
  private init() {
    this.off.push(
      this.bus.onListUpdate({
        type: this.type,
        add: row => {
          this.data.push(this.cache.factory(row))
        },
        remove: row => {
          const index = this.data.findIndex(item => item.id === row.id)
          if (index > -1) {
            this.data.splice(index, 1)
          }
        }
      })
    )
    this.query()
  }

  private query() {
    this.status.use(
      AppApi.project.manager.query({
        type: this.type,
      }).success(data => {
        this.data = data.map(item => this.cache.factory(item))
      })
    )
  }

  get isEmpty() {
    return this.data.length === 0
  }

  getData() {
    return [...this.data].sort((a, b) => a.status === b.status ?
      a.time && b.time ?
        (a.time > b.time ? -1 : 1)
        : a.time > 0 ? -1 : b.time > 0 ? 1 : 0 :
      b.status ? 1 : -1)
  }

  isAllChecked() {
    return this.data.length > 0 && this.data.every(project => project.checked)
  }

  getChecked() {
    return this.data.filter(project => project.checked)
  }

  allCheck(value: boolean) {
    this.data.forEach(project => project.checked = value)
  }

  @Destroy
  destroy() {
    this.off.forEach(fn => fn())
    this.off = []
    this.status.destroy()
    this.data = []
  }
}