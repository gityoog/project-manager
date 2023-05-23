import AppApi from "app/api"
import ProjectCategoryService from "app/common/project-category"
import ElNotification from "@/common/element-ui/notification"
import IElDialog from "components/el-dialog/service"
import { Inject, Service } from "ioc-di"
import { iProjectEditor } from "."
import LocaleService from "@/app/common/locale"
import IProcessEditor from "../process-editor/service"

const defData: Project.data = {
  id: '',
  name: '',
  context: '',
  build: '',
  dev: '',
  type: '',
  sort: '',
  deploy: '',
  dev_proc: null,
  build_proc: null,
}

@Service()
export default class IProjectEditor implements iProjectEditor {
  @Inject() private category!: ProjectCategoryService
  @Inject() locale!: LocaleService
  @Inject() private process!: IProcessEditor

  dialog = new IElDialog()
  data: Project.data = { ...defData }
  get types() {
    return this.category.data
  }
  open(data: Project.data, callback?: (data: Project.data) => void) {
    this.category.getData()
    this.data = { ...data }
    this.dialog.open(() => {
      this.dialog.status.use(
        AppApi.project.manager.save(this.data).success(data => {
          this.data = { ...data }
          this.dialog.close()
          ElNotification.success({
            title: '保存',
            message: '保存成功'
          })
          callback?.(data)
        })
      )
    })
  }
  add(data: Partial<Project.data>, callback: () => void) {
    this.open({ ...defData, ...data }, callback)
  }
  openDevProc() {
    this.process.open(this.data.dev_proc || {}, data => {
      this.data.dev_proc = data
    })
  }
  openBuildProc() {
    this.process.open(this.data.build_proc || {}, data => {
      this.data.build_proc = data
    })
  }
}