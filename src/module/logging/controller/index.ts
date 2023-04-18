import { All, Body, Controller, Inject, Session } from "@nestjs/common"
import LoggingService from "../service"

@Controller('/logging')
export default class LoggingController {
  constructor(
    @Inject(LoggingService) private service: LoggingService
  ) { }

  @All('/query')
  query(@Body() data: {
    page?: number,
    size?: number,
    params?: {}
  }) {
    return this.service.query(data)
  }

  @All('/clear')
  clear() {
    return this.service.clear()
  }
}
