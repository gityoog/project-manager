import ElDialog from "@/components/el-dialog"
import ElLocale from "@/common/element-ui/locale"
import { Already, Destroy, Inject, Service } from "ioc-di"
import i18n from './i18n'
import ITableList from "@/components/table-list/service"
import AppConfig from "../config"
import merge from 'lodash/merge'

type i18n = typeof i18n

@Service()
export default class LocaleService {
  @Inject() private config!: AppConfig
  private destroyCallbacks: Array<() => void> = []
  langs = [{
    name: '简体中文',
    value: 'zh-CN'
  }, {
    name: 'English',
    value: 'en'
  }, {
    name: '日本語',
    value: 'ja'
  }]
  t!: i18n['en']

  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.destroyCallbacks.push(
      this.config.watch('language', lang => {
        this.t = this.getI18n(lang)
        ElDialog.i18n.setLang(lang)
        ITableList.i18n.setLang(lang)
      }, true)
    )

    ElLocale.i18n((key, options) => {
      const keys = key.split('.')
      let current = this.t.el
      for (const k of keys) {
        if (current[k] !== undefined) {
          current = current[k]
        } else {
          return key
        }
      }
      if (options) {
        return (current as string).replace(/\{(\w+)\}/g, (match, key) => {
          return options[key]
        })
      }
      return current
    })
  }
  @Destroy
  destroy() {
    this.destroyCallbacks.forEach(fn => fn())
    this.destroyCallbacks = []
  }

  private getI18n(lang: string): i18n['en'] {
    if (lang in i18n) {
      return merge({}, i18n.en, i18n[lang as keyof i18n])
    }
    return i18n.en
  }
}