import OutputDeployBasicEditor from "../../basic/editor"
import { ToFC } from "@/common/vue"
import PostEditorRender from "./render"
import IPostEditorRender from "./render/service"
import { Already, Inject, Service } from "ioc-di"

@Service()
export default class OutputDeployEditorByPost extends OutputDeployBasicEditor {
  @Inject() private service!: IPostEditorRender
  setData(data: Json): void {
    const { url = '', type = '', key = '' } = data || {}
    this.service.setData({
      url,
      type,
      key
    })
  }
  getData(): Json {
    return this.service.getData()
  }

  Render: Tsx.Component | null = null

  constructor() {
    super()
    this.init()
  }

  @Already
  private init() {
    this.Render = ToFC(PostEditorRender, {
      service: this.service
    })
  }
}