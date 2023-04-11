import ElForm from 'element-ui/lib/form.js'
import 'element-ui/lib/theme-chalk/form.css'

export default ElForm as Tsx.ClassComponent<{
  model?: any
  rules?: any
  labelPosition?: string
  labelWidth?: string
  labelSuffix?: string
  inline?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  showMessage?: boolean
  size?: string
  disabled?: boolean
}>