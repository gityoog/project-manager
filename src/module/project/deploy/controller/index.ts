import { All, Body, Controller } from "@nestjs/common"
import ProjectDeployService from "../service"

@Controller('/project/deploy')
export default class ProjectDeployController {
  constructor(
    private service: ProjectDeployService
  ) { }

  @All('/start')
  start(@Body() data: {
    project: string
    process: string
    output: string
  }) {
    return this.service.run(data)
  }

  @All('/stop')
  stop(@Body() data: {
    project: string
    process: string
    output: string
  }) {
    return this.service.stop(data)
  }
}