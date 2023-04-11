import IPageInfo from "@/components/page-info/service"
import WRequest from "wrequest"
import Status from "@/common/status"
import Params from "./params"

type SingleApi<T, P> = (data: P) => WRequest<T[]>
type PageApi<T, P> = (data: {
  params: P
  page: number
  size: number
}) => WRequest<{
  data: T[]
  page: number
  total: number
}>

namespace ListService {
  export type Options<T, P, U extends boolean | IPageInfo.Options | void> = {
    api: U extends false ? SingleApi<T, P> : PageApi<T, P>
    params: P
    page?: U
    init?: boolean
  }
}

class ListService<T = any, P extends Record<string, any> = object, U extends boolean | IPageInfo.Options | void = void> {
  data: T[] = []
  status: Status = new Status()
  pageInfo
  params: Params<P>
  api
  constructor({ api, page, params, init = true }: ListService.Options<T, P, U>) {
    this.api = api
    this.params = new Params({
      data: params,
      onDone: () => {
        this.refresh()
      }
    })
    if (page !== false) {
      this.pageInfo = new IPageInfo({
        onUpdate: () => {
          this.query()
        },
        options: typeof page === 'object' ? page : undefined
      })
    } else {
      this.pageInfo = null
    }
    if (init) {
      this.refresh()
    }
  }
  refresh() {
    this.pageInfo?.setCurrentPage(1)
    this.query()
  }
  query() {
    const params = this.params.getValue()
    if (this.pageInfo) {
      this.status.use(
        (this.api as PageApi<T, P>)({
          params,
          page: this.pageInfo.currentPage,
          size: this.pageInfo.pageSize
        })
          .success(data => {
            this.data = data.data
            this.pageInfo?.setTotal(data.total)
            this.pageInfo?.setCurrentPage(data.page)
          })
      )
    } else {
      this.status.use(
        (this.api as SingleApi<T, P>)(params)
          .success(data => {
            this.data = data
          })
      )
    }
  }
  getParams() {
    return this.params.getValue()
  }
  setParams(params: Partial<P>) {
    this.params.setValue(params)
  }
  setData(data: T[]) {
    this.data = data
  }
  getRow(index: number) {
    return this.data[index]
  }
  removeRow(index: number) {
    this.data.splice(index, 1)
  }
  destroy() {
    this.data = []
    this.status.destroy()
    this.params.destroy()
    this.pageInfo?.destroy()
  }
}

export default ListService