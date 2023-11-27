import { All, Body, Controller } from "@nestjs/common"
import LoggingService from "../service"
import Logging from "@/common/logging/decorator"

@Controller('/logging')
export default class LoggingController {
  constructor(
    private service: LoggingService
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
  @Logging()
  clear() {
    return this.service.clear()
  }
}
