import AppConfig from "@/app/common/config"
import LocaleService from "@/app/common/locale"
import ElMessage from "@/common/element-ui/message"
import Status from "@/common/status"
import { Service, Already, Inject } from "ioc-di"
import { iLocalSetting } from "."

@Service()
export default class ILocalSetting implements iLocalSetting {
  @Inject() locale!: LocaleService
  @Inject() private config!: AppConfig

  private get $t() {
    return this.locale.t.setting.local
  }
  status = new Status
  data = {
    lang: '',
    fontSize: '',
    fontFamily: '',
    stats: false
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
    this.data.lang = this.config.language
    this.data.fontSize = this.config.terminal.fontSize.toString()
    this.data.fontFamily = this.config.terminal.fontFamily
    this.data.stats = this.config.stats
  }
  refresh() {
    this.query()
  }
  save() {
    this.config.language = this.data.lang
    this.config.terminal = {
      fontSize: parseInt(this.data.fontSize),
      fontFamily: this.data.fontFamily
    }
    this.config.stats = this.data.stats
    ElMessage.success(this.$t.saveSuccess)
  }
}