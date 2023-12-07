import Logging from "@/common/logging/decorator"
import { All, Body, Controller, Inject, UseFilters } from "@nestjs/common"
import ProjectService from "../service"
import ProjectDto from "../service/dto"
import ProjectProcessService from "../process/service"
import ProjectDeployService from "../deploy/service"

@Controller('/project')
export default class ProjectController {
  constructor(
    private project: ProjectService,
    private process: ProjectProcessService,
    private deploy: ProjectDeployService
  ) { }

  @All('/query')
  async query(@Body() data: { type?: string | null }) {
    const projects = await this.project.query(data)
    const result = []
    for (const data of projects) {
      result.push({
        data,
        process: await this.process.info(data.id)
      })
    }
    return result
  }

  @All('/save')
  @Logging({ description: ([data], result) => result.id + ':' + data.name })
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
    const process = detail?.process
    let result = []
    if (process?.length) {
      for (let index = 0; index < process.length; index++) {
        const item = process[index]
        const main = index === 0
        result.push({
          process: item,
          info: main ? null : await this.process.info(data.id, item.id),
          deploy: await this.deploy.info({
            project: data.id,
            process: item.id
          }),
          main
        })
      }
    }
    return result
  }
}