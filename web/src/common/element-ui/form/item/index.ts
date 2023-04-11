import ElFormItem from 'element-ui/lib/form-item.js'
import 'element-ui/lib/theme-chalk/form-item.css'

export default ElFormItem as Tsx.ClassComponent<{
  label?: string
  prop?: string
  labelWidth?: string
  required?: boolean
  rules?: any
  error?: string
  validateStatus?: string
  for?: string
  showMessage?: boolean
  inlineMessage?: boolean
  size?: string
  disabled?: boolean
}>