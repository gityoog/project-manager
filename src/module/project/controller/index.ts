import { All, Body, Controller, Inject } from "@nestjs/common"
import ProjectService from "../service"
import ProjectDto from "../service/dto"

@Controller('/project')
export default class ProjectController {
  constructor(
    @Inject(ProjectService) private project: ProjectService
  ) { }

  @All('/query')
  query(@Body() data: { type?: string | null }) {
    return this.project.query(data)
  }


  @All('/save')
  save(@Body() data: ProjectDto) {
    return this.project.save(data)
  }

  @All('/remove')
  remove(@Body() data: { id: string } | { ids: string[] }) {
    return this.project.remove(data)
  }
}