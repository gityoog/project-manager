import ElCheckBox from "element-ui/lib/checkbox.js"
import 'element-ui/lib/theme-chalk/checkbox.css'

export default ElCheckBox as Tsx.ClassComponent<{
  label?: string
  trueLabel?: string
  falseLabel?: string
  disabled?: boolean
  checked?: boolean
  indeterminate?: boolean
  name?: string
  id?: string
  controls?: string
  border?: boolean
  size?: string
}>