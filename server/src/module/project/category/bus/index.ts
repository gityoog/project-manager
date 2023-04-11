import EntityEmitter from "@/common/entity-emitter"
import LoggingService from "@/module/logging/service"
import ProjectCategoryEntity from "@/module/project/category/service/entity"
import { Injectable } from "@nestjs/common"

@Injectable()
export default class ProjectCategoryBus extends EntityEmitter<ProjectCategoryEntity> {
  constructor(
    private logging: LoggingService
  ) {
    super()
    this.on((action, row) => {
      this.logging.save({
        action,
        target: 'ProjectCategory',
        description: `${row.name}`,
      })
    })
  }
}