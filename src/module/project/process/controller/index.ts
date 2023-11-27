import { All, Body, Controller } from "@nestjs/common"
import ProjectProcessService from "../service"

@Controller('/project/process')
export default class ProjectProcessController {
  constructor(
    private service: ProjectProcessService
  ) { }

  @All('/info')
  info(@Body() data: {
    project: string
    id?: string
  }) {
    return this.service.info(data.project, data.id)
  }

  @All('/start')
  start(@Body() data: {
    project: string
    id?: string
  }) {
    return this.service.run(data.project, data.id)
  }

  @All('/stop')
  stop(@Body() data: {
    project: string
    id?: string
  }) {
    return this.service.stop(data.project, data.id)
  }
}