import { ModuleMetadata } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import ProjectOutputBus from "./bus"
import ProjectOutputController from "./controller"
import ProjectOutputService from "./service"
import ProjectOutputEntity from "./service/entity"

const ProjectOutput: ModuleMetadata = {
  controllers: [
    ProjectOutputController
  ],
  providers: [
    ProjectOutputService,
    ProjectOutputBus
  ],
  imports: [
    TypeOrmModule.forFeature([
      ProjectOutputEntity
    ])
  ]
}

export default ProjectOutput