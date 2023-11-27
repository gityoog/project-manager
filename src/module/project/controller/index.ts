import Logging from "@/common/logging/decorator"
import { All, Body, Controller, Inject, UseFilters } from "@nestjs/common"
import ProjectService from "../service"
import ProjectDto from "../service/dto"
import ProjectProcessService from "../process/service"

@Controller('/project')
export default class ProjectController {
  constructor(
    private project: ProjectService,
    private process: ProjectProcessService
  ) { }

  @All('/query')
  async query(@Body() data: { type?: string | null }) {
    const projects = await this.project.query(data)
    return await Promise.all(
      projects.map(async data => ({
        data,
        process: await this.process.info(data.id)
      }))
    )
  }

  @All('/save')
  @Logging({ description: ([data]) => data.name })
  save(@Body() data: ProjectDto) {
    return this.project.save(data)
  }

  @All('/remove')
  @Logging({ description: ([data]) => 'id' in data ? data.id : data.ids.join(',') })
  remove(@Body() data: { id: string } | { ids: string[] }) {
    return this.project.remove(data)
  }

  @All('/detail')
  async detail(@Body() data: { id: string }) {
    const detail = await this.project.detail(data.id)
    return Promise.all(
      detail?.process?.filter((_, index) => index !== 0).map(async item => {
        return {
          process: item,
          info: await this.process.info(data.id, item.id),
        }
      }) || []
    )
  }
}