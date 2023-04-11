import EntityEmitter from "@/common/entity-emitter"
import LoggingService from "@/module/logging/service"
import ProjectEntity from "../service/entity"
import { Injectable } from "@nestjs/common"

@Injectable()
export default class ProjectBus extends EntityEmitter<ProjectEntity> {
  constructor(
    private logging: LoggingService
  ) {
    super()
    this.on((action, row) => {
      this.logging.save({
        action,
        target: 'Project',
        description: `${row.name}`,
      })
    })
  }
}