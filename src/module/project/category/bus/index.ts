import EntitySubscriber from "@/common/entity-subscriber"
import ProjectCategoryEntity from "@/module/project/category/service/entity"
import { Injectable } from "@nestjs/common"

@Injectable()
export default class ProjectCategoryBus extends EntitySubscriber<ProjectCategoryEntity> {
  protected Entity = ProjectCategoryEntity
}