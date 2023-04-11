import { GenericComponent } from '@/common/vue'
import Table from 'element-ui/lib/table.js'
import 'element-ui/lib/theme-chalk/table.css'
import { ElementUIComponentSize } from 'element-ui/types/component'

const ElTable = GenericComponent<<T>(props: {
  data?: T[]
  stripe?: boolean
  border?: boolean
  size?: ElementUIComponentSize
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  maxHeight?: string | number | null
}) => JSX.Element>(Table)

export default ElTable