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