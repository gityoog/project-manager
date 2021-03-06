import { formatDate } from "@/common/utils/date"
import { All, Body, Controller, Get, Query, Res } from "@nestjs/common"
import { Response } from "express"
import ProjectOutputService from "../service"
import fs from 'fs'

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
    if (file.path && fs.existsSync(file.path)) {
      response.send(fs.readFileSync(file.path))
    } else if (file.content) {
      response.send(file.content)
    } else {
      response.sendStatus(404)
    }
  }

  @All('/clear')
  clear() {
    return this.service.clear()
  }
}