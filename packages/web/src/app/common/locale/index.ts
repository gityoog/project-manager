import LocalStorageItem from "@/common/local-storage-item"
import { Already, Destroy, Service } from "ioc-di"
import i18n from './i18n'

type i18n = typeof i18n

@Service()
export default class LocaleService {
  private local = new LocalStorageItem<string>({
    default: () => navigator.language === 'zh-CN' ? 'zh-CN' : 'en',
    key: 'app-locale'
  })
  t!: i18n[keyof i18n]
  constructor() {
    this.init()
  }
  @Already
  private init() {
    this.local.onChange(() => {
      if (this.lang in i18n) {
        this.t = i18n[this.lang as keyof i18n]
      } else {
        this.t = i18n['en']
      }
    }, true)
  }
  langs = [{
    name: '简体中文',
    value: 'zh-CN'
  }, {
    name: 'English',
    value: 'en'
  }]
  get lang() {
    return this.local.get()
  }
  set lang(value) {
    this.local.set(value)
  }
  @Destroy
  destroy() {
    this.local.destroy()
  }
}