import AppApi from "app/api"
import ITableList from "@/components/table-list/service"
import { Service } from "ioc-di"
import { iLoggingManager } from "."

@Service()
export default class ILoggingManager implements iLoggingManager {
  remove(index: number) {
    this.table.remove(index, data => AppApi.logging.remove(data))
  }
  table = new ITableList({
    params: {},
    api: data => AppApi.logging.query(data)
  })
  refresh() {
    this.table.refresh()
  }
}