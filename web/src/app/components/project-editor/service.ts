import AppApi from "app/api"
import ProjectCategoryService from "app/common/project-category"
import ElNotification from "@/common/element-ui/notification"
import IElDialog from "components/el-dialog/service"
import { Inject, Service } from "ioc-di"
import { iProjectEditor } from "."

type data = {
  id: string
  name: string
  context: string
  build: string
  dev: string
  type: string
  sort: string
  deploy: string
}

const defData = {
  id: '',
  name: '',
  context: '',
  build: '',
  dev: '',
  type: '',
  sort: '',
  deploy: ''
}

@Service()
export default class IProjectEditor implements iProjectEditor {
  @Inject() private category!: ProjectCategoryService
  dialog = new IElDialog({ title: '项目信息' })
  data = { ...defData }
  get types() {
    return this.category.data
  }
  open(data: data, callback?: (data: data) => void) {
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
  add(data: Partial<data>, callback: () => void) {
    this.open({ ...defData, ...data }, callback)
  }
}