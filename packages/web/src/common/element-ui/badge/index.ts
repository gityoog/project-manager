import ElBadge from "element-ui/lib/badge.js"
import 'element-ui/lib/theme-chalk/badge.css'

export default ElBadge as Tsx.ClassComponent<{
  value?: string | number
  max?: string | number
  isDot?: boolean
  hidden?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  color?: string
}>