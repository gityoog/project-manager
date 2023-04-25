declare module "element-ui/lib/*.js" {
  class Component { }
  export default Component
}

declare module 'element-ui/lib/loading.js' {
  import { PluginObject } from "vue"
  const Loading: PluginObject
  export default Loading
}

declare module 'element-ui/lib/notification.js' {
  import { Notification } from 'element-ui'
  export default Notification
}

declare module 'element-ui/lib/message.js' {
  import { Message } from 'element-ui'
  export default Message
}

declare module 'element-ui/lib/locale' {
  const Locale: {
    use(data: any): void
    i18n(fn: (key: string, options: string) => string): void
  }
  export default Locale
}

declare module 'element-ui/lib/locale/lang/*' {
  const lang: any
  export default lang
}