import ProjectEntity from "../service/entity"
import { Injectable } from "@nestjs/common"
import EntitySubscriber from "@/common/entity-subscriber"

@Injectable()
export default class ProjectBus extends EntitySubscriber<ProjectEntity> {
  protected Entity = ProjectEntity
}