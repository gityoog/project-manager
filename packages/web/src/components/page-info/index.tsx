import { FC } from '@/common/vue'
import ElPagination from '@/common/element-ui/pagination'

export interface iPageInfo {
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
  total: number
  background: boolean
  pagerCount: number
  callback: {
    'update:pageSize'(size: number): void
    'update:currentPage'(page: number): void
    'size-change'(): void
    'current-change'(): void
  }
}

const PageInfo = FC<{ service: iPageInfo }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { currentPage, pageSize, pageSizes, layout, total, callback, background, pagerCount } = service
    return <ElPagination
      currentPage={currentPage}
      pageSize={pageSize}
      pageSizes={pageSizes}
      layout={layout}
      total={total}
      on={callback}
      background={background}
      pagerCount={pagerCount}
    />
  }
})
export default PageInfo