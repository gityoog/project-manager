import { All, Body, Controller, Inject, Session } from "@nestjs/common"
import ProjectCategoryService from "../service"
import ProjectCategoryDto from "../service/dto"
import Logging from "@/common/logging/decorator"

@Controller('/project/category')
export default class ProjectCategoryController {
  constructor(
    @Inject(ProjectCategoryService) private project: ProjectCategoryService
  ) { }

  @All('/query')
  query() {
    return this.project.query()
  }

  @All('/save')
  @Logging({ description: ([data]) => data.name })
  save(@Body() data: ProjectCategoryDto) {
    return this.project.save(data)
  }

  @All('/remove')
  @Logging({ description: ([data]) => data.id })
  remove(@Body() { id }: { id: string }) {
    return this.project.remove(id)
  }

  @All('/removes')
  @Logging({ description: ([data]) => data.map(({ id }) => id).join(',') })
  removes(@Body() projects: { id: string }[]) {
    return Promise.all(projects.map(project => this.project.remove(project.id)))
  }
}
