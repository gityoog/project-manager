import { All, Body, Controller, Inject } from "@nestjs/common"
import ProjectProcessDevService from "../process/dev/service"
import ProjectService from "../service"
import ProjectDto from "../service/dto"

@Controller('/project')
export default class ProjectController {
  constructor(
    private project: ProjectService,
    private dev: ProjectProcessDevService
  ) { }

  @All('/query')
  async query(@Body() data: { type?: string | null }) {
    const projects = await this.project.query(data)
    return projects.map(data => ({
      data,
      dev: this.dev.info(data.id)
    }))
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