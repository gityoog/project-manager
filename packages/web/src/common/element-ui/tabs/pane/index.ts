import ElTabPane from 'element-ui/lib/tab-pane.js'
import 'element-ui/lib/theme-chalk/tab-pane.css'

export default ElTabPane as Tsx.ClassComponent<{
  label?: string
  labelContent?: any
  name?: string
  closable?: boolean
  disabled?: boolean
}>