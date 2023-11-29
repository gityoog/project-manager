import { Inject, Service } from "ioc-di"
import { iPostEditorRender } from "."
import LocaleService from "@/app/common/locale"

type data = {
  url: string
  type: string
  key: string
}

@Service()
export default class IPostEditorRender implements iPostEditorRender {
  @Inject() locale!: LocaleService
  data = {
    url: '',
    type: '',
    key: ''
  }
  setData(data: data) {
    this.data = {
      url: data.url || '',
      type: data.type || '',
      key: data.key || 'file'
    }
  }
  getData() {
    return {
      url: this.data.url,
      type: this.data.type,
      key: this.data.key
    }
  }
}