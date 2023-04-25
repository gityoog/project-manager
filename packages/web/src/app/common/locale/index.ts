import ElDialog from "@/components/el-dialog"
import ElLocale from "@/common/element-ui/locale"
import LocalStorageItem from "@/common/local-storage-item"
import { Already, Destroy, Service } from "ioc-di"
import i18n from './i18n'
import ITableList from "@/components/table-list/service"

type i18n = typeof i18n

@Service()
export default class LocaleService {
  private value = new LocalStorageItem<string>({
    default: () => navigator.language === 'zh-CN' ? 'zh-CN' : 'en',
    key: 'app-locale'
  })
  langs = [{
    name: '简体中文',
    value: 'zh-CN'
  }, {
    name: 'English',
    value: 'en'
  }]
  t!: i18n[keyof i18n]
  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.value.onChange(() => {
      if (this.lang in i18n) {
        this.t = i18n[this.lang as keyof i18n]
      } else {
        this.t = i18n['en']
      }
      ElDialog.i18n.setLang(this.lang)
      ITableList.i18n.setLang(this.lang)
    }, true)

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
  get lang() {
    return this.value.get()
  }
  set lang(value) {
    this.value.set(value)
  }
  @Destroy
  destroy() {
    this.value.destroy()
  }
}