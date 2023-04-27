import { Already, Concat, Destroy, Inject, Service } from "ioc-di"
import TabSelect from "@/common/tab-select"
import { iAppControl } from "."
import IProjectList from "../project-list/service"
import IProjectEditor from "../project-editor/service"
import IAppSetting from "../setting/service"
import IProjectSelector from "../project-selector/service"
import ProjectCategoryService from "app/common/project-category"
import IProjectListCache from "app/common/project-list-cache"
import IProjectBuilder from "../project-builder/service"
import LocaleService from "@/app/common/locale"

type tab = {
  name: string
  data: Project.category | null
  visible: boolean
}

@Service()
export default class IAppControl implements iAppControl {
  @Inject() editor!: IProjectEditor
  @Inject() setting!: IAppSetting
  @Inject() selector!: IProjectSelector
  @Inject() builder!: IProjectBuilder
  @Inject() private category!: ProjectCategoryService
  @Inject() private cache!: IProjectListCache
  @Inject() private locale!: LocaleService

  private tab = new TabSelect<tab>({
    data: [],
    activedIndex: -1
  })

  list: IProjectList | null = null
  get tabs() {
    return this.tab.data
  }

  active(index: number) {
    this.tab.activeIndex(index)
  }

  isActived(index: number) {
    return this.tab.isActived(this.tabs[index])
  }

  private getActived() {
    if (this.tab.actived) {
      const data = this.tab.actived.data
      return data === null ? null : data.id
    }
  }

  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.tab.onChange((value) => {
      if (value) {
        this.list = this.cache.factory(value.data)
      } else {
        this.list = null
      }
      this.selector.setList(this.list)
    })
    this.category.onChange(() => {
      this.category.getData()
        .success(({ data }) => {
          const self = this
          const category = [...data.map(item => ({
            name: item.name,
            data: item,
            visible: true
          })), {
            get name() {
              return self.locale.t.tabs.other
            },
            data: null,
            get visible() {
              return self.cache.showOther
            }
          }]
          const id = this.getActived()
          const activedIndex =
            id === null ? category.length - 1 :
              id ? category.findIndex(item => item.data?.id === id) : 0
          this.tab.init({
            data: category,
            activedIndex: activedIndex > 0 ? activedIndex : 0
          })
        })
    })
  }
  add() {
    this.editor.add({
      type: this.getActived() || undefined
    }, () => { })
  }
  remove() {
    this.selector.toggle()
  }
  openSetting() {
    this.setting.open()
  }
}