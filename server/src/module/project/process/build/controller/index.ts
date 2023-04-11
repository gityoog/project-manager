import { All, Body, Controller } from "@nestjs/common"
import ProjectProcessBuildService from "../service"

@Controller('/project/process/build')
export default class ProjectProcessBuildController {
  constructor(
    private service: ProjectProcessBuildService
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