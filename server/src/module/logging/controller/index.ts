import { All, Body, Controller, Inject, Session } from "@nestjs/common"
import LoggingService from "../service"

@Controller('/logging')
export default class LoggingController {
  constructor(
    @Inject(LoggingService) private project: LoggingService
  ) { }

  @All('/query')
  query(@Body() data: {
    page?: number,
    size?: number,
    params?: {}
  }) {
    return this.project.query(data)
  }
}
