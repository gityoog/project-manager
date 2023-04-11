import { formatDate } from "@/common/utils/date"
import { All, Body, Controller, Get, Query, Res } from "@nestjs/common"
import { Response } from "express"
import ProjectOutputService from "../service"

@Controller('/project/output')
export default class ProjectOutputController {
  constructor(
    private service: ProjectOutputService
  ) { }

  @All('/query')
  query(@Body() { project }: { project: string }) {
    return this.service.query(project)
  }

  @All('/remove')
  remove(@Body() { id }: { id: string }) {
    return this.service.remove(id)
  }

  @Get('/download')
  async download(@Query() { id }: { id: string }, @Res() response: Response) {
    const file = await this.service.read(id)
    if (!file) {
      response.sendStatus(404)
      return
    }
    response.attachment(file.name + formatDate(file.created_at, 'YYYYMMDDHHmmss') + '.zip')
    response.send(file.content)
  }
}