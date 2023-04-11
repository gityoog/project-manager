import EntityEmitter from "@/common/entity-emitter"
import LoggingService from "@/module/logging/service"
import { Injectable } from "@nestjs/common"
import ProjectOutputEntity from "../service/entity"

@Injectable()
export default class ProjectOutputBus extends EntityEmitter<ProjectOutputEntity> {
  constructor(
    private logging: LoggingService
  ) {
    super()
    this.on((action, row) => {
      this.logging.save({
        action,
        target: 'Output',
        description: `${row.name}`,
      })
    })
  }
}