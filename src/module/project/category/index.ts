import { ModuleMetadata } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import ProjectCategoryBus from "./bus"
import ProjectCategoryController from "./controller"
import ProjectCategoryService from "./service"
import ProjectCategoryEntity from "./service/entity"
import ProjectCategoryWsGateway from "./ws"

const ProjectCategory: ModuleMetadata = {
  controllers: [
    ProjectCategoryController
  ],
  providers: [
    ProjectCategoryService,
    ProjectCategoryWsGateway,
    ProjectCategoryBus
  ],
  imports: [
    TypeOrmModule.forFeature([
      ProjectCategoryEntity
    ])
  ]
}

export default ProjectCategory