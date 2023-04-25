import AppApi from "app/api"
import ITableList from "@/components/table-list/service"
import { Inject, Service } from "ioc-di"
import { iLoggingManager } from "."
import LocaleService from "@/app/common/locale"

@Service()
export default class ILoggingManager implements iLoggingManager {
  @Inject() locale!: LocaleService

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