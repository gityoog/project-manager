import EntitySubscriber from "@/common/entity-subscriber"
import { Inject, Injectable } from "@nestjs/common"
import ProjectOutputEntity from "../service/entity"

@Injectable()
export default class ProjectOutputBus extends EntitySubscriber<ProjectOutputEntity> {
  protected Entity = ProjectOutputEntity
}