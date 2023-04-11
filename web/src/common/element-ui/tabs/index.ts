import { TabPane } from 'element-ui'
import ElTabs from 'element-ui/lib/tabs.js'
import 'element-ui/lib/theme-chalk/tabs.css'

export default ElTabs as Tsx.ClassComponent<{
  type?: 'card' | 'border-card'
  closable?: boolean
  addable?: boolean
  modelValue?: string | number
  editable?: boolean
  stretch?: boolean
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  'on-tab-click'?: (tab: TabPane, event: Event) => void
}>