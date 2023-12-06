import { formatDate } from "@/common/utils/date"
import { All, Body, Controller, Get, Query, Res } from "@nestjs/common"
import { Response } from "express"
import ProjectOutputService from "../service"
import Logging from "@/common/logging/decorator"

@Controller('/project/output')
export default class ProjectOutputController {
  constructor(
    private service: ProjectOutputService
  ) { }

  @All('/query')
  async query(@Body() { project, process }: { project: string, process?: string }) {
    return this.service.query(project, process)
  }

  @All('/remove')
  @Logging({ description: ([data]) => data.id })
  remove(@Body() { id }: { id: string }) {
    return this.service.remove(id)
  }

  @Get('/download')
  async download(@Query() { id }: { id: string }, @Res() response: Response) {
    const result = await this.service.read(id)
    if (!result) {
      response.sendStatus(404)
    } else {
      const { data: { name, created_at }, content } = result
      if (content) {
        response.attachment(name + formatDate(created_at, 'YYYYMMDDHHmmss') + '.zip')
        response.send(content)
      } else {
        response.sendStatus(404)
      }
    }
  }

  @All('/clear')
  @Logging()
  clear() {
    return this.service.clear()
  }
}