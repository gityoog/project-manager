import { All, Body, Controller, Inject, Session } from "@nestjs/common"
import ProjectCategoryService from "../service"
import ProjectCategoryDto from "../service/dto"

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
  save(@Body() data: ProjectCategoryDto) {
    return this.project.save(data)
  }

  @All('/remove')
  remove(@Body() { id }: { id: string }) {
    return this.project.remove(id)
  }

  @All('/removes')
  removes(@Body() projects: { id: string }[]) {
    return Promise.all(projects.map(project => this.project.remove(project.id)))
  }
}
