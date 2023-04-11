import ElPagination from 'element-ui/lib/pagination.js'
import 'element-ui/lib/theme-chalk/pagination.css'

export default ElPagination as Tsx.ClassComponent<{
  layout?: string
  background?: boolean
  pageSize?: number
  pagerCount?: number
  currentPage?: number
  total?: number
  pageSizes?: number[]
}>