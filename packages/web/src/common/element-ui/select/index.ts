import ElSelect from 'element-ui/lib/select.js'
import 'element-ui/lib/theme-chalk/select.css'

export default ElSelect as Tsx.ClassComponent<{
  size?: string
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  allowCreate?: boolean
  loading?: boolean
  popperClass?: string
  remote?: boolean
  remoteMethod?: Function
  loadingText?: string
}>