import ElOption from 'element-ui/lib/option.js'
import 'element-ui/lib/theme-chalk/option.css'

export default ElOption as Tsx.ClassComponent<{
  value?: string | number | boolean
  label?: string | number
  disabled?: boolean
  created?: boolean
}>