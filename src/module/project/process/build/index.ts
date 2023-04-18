import { ModuleMetadata } from "@nestjs/common"
import ProjectProcessBuildBus from "./bus"
import ProjectProcessBuildController from "./controller"
import ProjectProcessBuildService from "./service"
import ProjectProcessBuildWsGateway from "./ws"

const ProjectProcessBuild: ModuleMetadata = {
  controllers: [
    ProjectProcessBuildController
  ],
  providers: [
    ProjectProcessBuildService,
    ProjectProcessBuildWsGateway,
    ProjectProcessBuildBus
  ]
}

export default ProjectProcessBuild