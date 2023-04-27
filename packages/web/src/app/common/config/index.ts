import LocalStorageItem, { LocalStorageItems } from "@/common/local-storage-item"
import { Destroy, Service } from "ioc-di"

@Service()
export default class AppConfig {
  private items = new LocalStorageItems({
    language: new LocalStorageItem<string>({
      default: () => navigator.language === 'zh-CN' ? 'zh-CN' : 'en',
      key: 'AppConfig_Language'
    }),
    terminal: new LocalStorageItem({
      key: 'AppConfig_Terminal',
      default: {
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        fontSize: 12
      }
    })
  })


  language: string
  terminal: {
    readonly fontFamily: string
    readonly fontSize: number
  }
  watch
  constructor() {
    this.language = this.items.bind(this, 'language')
    this.terminal = this.items.bind(this, 'terminal')
    this.watch = this.items.watch
  }

  @Destroy
  destroy() {
    this.items.destroy
  }
}