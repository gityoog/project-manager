import ElDialog from 'element-ui/lib/dialog.js'
import 'element-ui/lib/theme-chalk/dialog.css'

export default ElDialog as Tsx.ClassComponent<{
  title?: string
  visible?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  width?: string
  fullscreen?: boolean
  top?: string
  customClass?: string
  center?: boolean
}>