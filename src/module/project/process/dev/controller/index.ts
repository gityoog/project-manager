import { All, Body, Controller } from "@nestjs/common"
import ProjectProcessDevService from "../service"

@Controller('/project/process/dev')
export default class ProjectProcessDevController {
  constructor(
    private service: ProjectProcessDevService
  ) { }

  @All('/info')
  info(@Body() data: {
    id: string
  }) {
    return this.service.info(data.id)
  }

  @All('/start')
  start(@Body() data: {
    id: string
  }) {
    return this.service.run(data.id)
  }

  @All('/stop')
  stop(@Body() data: {
    id: string
  }) {
    return this.service.stop(data.id)
  }
}