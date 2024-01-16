import ElInput from "element-ui/lib/input.js"
import 'element-ui/lib/theme-chalk/input.css'

export default ElInput as Tsx.ClassComponent<{
  type?: 'text' | 'textarea' | 'password' | 'number'
  value?: string
  size?: string
  resize?: string
  form?: string
  readonly?: boolean
  disabled?: boolean
  clearable?: boolean
  showPassword?: boolean
  prefixIcon?: string
  suffixIcon?: string
  rows?: number
  autosize?: boolean | { minRows: number, maxRows: number }
  autocomplete?: string
  name?: string
  placeholder?: string
  tabindex?: string
  validateEvent?: boolean
  nativeOnKeypress?: (event: KeyboardEvent) => void
}>
