import ElRadio from "element-ui/lib/radio.js"
import 'element-ui/lib/theme-chalk/radio.css'

export default ElRadio as Tsx.ClassComponent<{
  value?: any
  label?: string | number
  disabled?: boolean
  name?: string
  border?: boolean
  size?: string
}>