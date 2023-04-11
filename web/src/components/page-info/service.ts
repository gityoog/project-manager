import { iPageInfo } from "."

type options = {
  layout?: string
  background?: boolean
  pageSize?: number
  pagerCount?: number
}

namespace IPageInfo {
  export type Options = options
}

class IPageInfo implements iPageInfo {
  currentPage = 1
  pageSizes = [10, 20, 50, 999, 9999]
  pageSize = 20
  layout = 'total, sizes, prev, pager, next, jumper'
  pagerCount = 7  //大于等于 5 且小于等于 21 的奇数
  total = 0
  background = false
  callback
  constructor({ onUpdate, options }: { onUpdate(): void, options?: options }) {
    if (options) {
      if (options.layout) {
        this.layout = options.layout
      }
      if (options.background !== undefined) {
        this.background = options.background
      }
      if (options.pageSize) {
        this.pageSize = options.pageSize
      }
      if (options.pagerCount) {
        this.pagerCount = options.pagerCount
      }
    }
    this.callback = {
      'update:pageSize': (size: number) => {
        this.pageSize = size
      },
      'update:currentPage': (page: number) => {
        this.currentPage = page
      },
      'size-change': () => {
        onUpdate()
      },
      'current-change': () => {
        onUpdate()
      }
    } as const
  }
  setTotal(total: number) {
    this.total = total
  }
  setCurrentPage(currentPage: number) {
    this.currentPage = currentPage
  }
  destroy() {
    this.callback = null!
  }
}

export default IPageInfo