import ElButton from "element-ui/lib/button.js"
import 'element-ui/lib/theme-chalk/button.css'

export default ElButton as Tsx.ClassComponent<{
  size?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  icon?: string
  nativeType?: string
  loading?: boolean
  disabled?: boolean
  plain?: boolean
  autofocus?: boolean
  round?: boolean
  circle?: boolean
  title?: string
}>