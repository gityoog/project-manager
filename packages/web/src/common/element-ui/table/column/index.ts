import { GenericComponent } from '@/common/vue'
import TableColumn from 'element-ui/lib/table-column.js'
import 'element-ui/lib/theme-chalk/table-column.css'

const ElTableColumn =  GenericComponent<<T>(props: {
  type?: 'index' | 'selection' | 'expand' | 'html'
  label?: string
  prop?: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  align?: 'left' | 'center' | 'right'
  scopedSlots?: Tsx.ScopedSlots<{
    default: { row: T, $index: number }
  }>
}) => JSX.Element>(TableColumn)

export default ElTableColumn