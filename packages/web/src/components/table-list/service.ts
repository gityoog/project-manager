import Confirm from "@/common/comfirm"
import ElNotification from "@/common/element-ui/notification"
import ListService from "@/common/list"
import WRequest from "wrequest"
import { iTableList } from "."
import IPageInfo from "../page-info/service"

export default class ITableList<T = any, P extends Record<string, any> = object, U extends boolean | IPageInfo.Options | void = void> implements iTableList<T, P> {
  private list
  get status() {
    return this.list.status
  }
  get data() {
    return this.list.data
  }
  get pageInfo() {
    return this.list.pageInfo
  }
  get params() {
    return this.list.params
  }
  key = 'TableList_' + Math.random()
  constructor({ api, params, page, init }: ListService.Options<T, P, U>) {
    this.list = new ListService({ api, params, page, init })
  }
  refresh() {
    this.list.refresh()
  }
  getRow(index: number) {
    return this.list.getRow(index)
  }
  remove(index: number, callback: (data: T) => WRequest<any>) {
    const data = this.list.getRow(index)
    Confirm({
      title: '删除确认',
      message: '删除后不可恢复, 是否继续',
      callback: ({ status, close }) => {
        status.use(
          callback(data).success(() => {
            close()
            ElNotification.success({
              title: '删除操作',
              message: '删除成功'
            })
            this.list.removeRow(index, data)
          })
        )
      }
    })
  }
}