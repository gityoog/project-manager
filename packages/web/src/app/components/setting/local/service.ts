import LocaleService from "@/app/common/locale"
import ElMessage from "@/common/element-ui/message"
import Status from "@/common/status"
import { Service, Already, Inject } from "ioc-di"
import { iLocalSetting } from "."

@Service()
export default class ILocalSetting implements iLocalSetting {
  @Inject() locale!: LocaleService
  private get $t() {
    return this.locale.t.setting.server
  }
  status = new Status
  data = {
    lang: ''
  }
  langs: {
    name: string
    value: string
  }[] = []
  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.langs = this.locale.langs
    this.query()
  }

  private query() {
    this.data.lang = this.locale.lang
  }
  refresh() {
    this.query()
  }
  save() {
    this.locale.lang = this.data.lang
  }
}