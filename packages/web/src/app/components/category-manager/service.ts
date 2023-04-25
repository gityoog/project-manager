import AppApi from "app/api"
import ProjectCategoryService from "app/common/project-category"
import ElMessage from "@/common/element-ui/message"
import ITableList from "@/components/table-list/service"
import { Already, Inject, Service } from "ioc-di"
import { iProjectCategoryManager } from "."
import LocaleService from "@/app/common/locale"

@Service()
export default class IProjectCategoryManager implements iProjectCategoryManager {
  @Inject() private category!: ProjectCategoryService
  @Inject() locale!: LocaleService
  private get $t() {
    return this.locale.t.category
  }
  loading = false
  form = {
    id: '',
    name: '',
    sort: ''
  }
  table = new ITableList({
    page: false,
    init: false,
    params: {},
    api: () => this.category.getData().map(({ data }) => data)
  })
  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.category.onChange(() => {
      this.table.refresh()
    })
  }
  private clear() {
    this.form.id = ''
    this.form.name = ''
    this.form.sort = ''
  }
  cancel() {
    this.clear()
  }
  remove(index: number) {
    this.table.remove(index, data => AppApi.project.category.remove(data))
  }
  edit(index: number) {
    const row = this.table.getRow(index)
    this.form = {
      id: row.id,
      name: row.name,
      sort: row.sort
    }
  }
  save() {
    if (!this.form.name) {
      return ElMessage.warning(this.$t.tip.name)
    }
    AppApi.project.category.save(this.form)
      .success(() => {
        this.clear()
      })
      .load(() => this.loading = true)
      .final(() => {
        this.loading = false
      })
  }
}