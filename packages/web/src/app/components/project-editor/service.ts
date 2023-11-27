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
  type: '',
  sort: '',
  process: null
}

@Service()
export default class IProjectEditor implements iProjectEditor {
  @Inject() private category!: ProjectCategoryService
  @Inject() locale!: LocaleService
  @Inject() process!: IProcessEditor

  dialog = new IElDialog()
  data: Project.data = { ...defData }
  get types() {
    return this.category.data
  }
  open(data: Project.data, callback?: () => void) {
    this.category.getData()
    this.data = { ...data }
    this.process.setData(this.data.process || [])
    this.dialog.open(() => {
      this.dialog.status.use(
        AppApi.project.manager.save({
          ...this.data,
          process: this.process.getData()
        }).success(() => {
          // this.data = { ...data }
          this.dialog.close()
          ElNotification.success({
            title: '保存',
            message: '保存成功'
          })
          callback?.()
        })
      )
    })
  }
  add(data: Partial<Project.data>, callback: () => void) {
    this.open({ ...defData, ...data }, callback)
  }
}