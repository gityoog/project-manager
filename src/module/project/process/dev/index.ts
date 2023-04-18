import { ModuleMetadata } from "@nestjs/common"
import ProjectProcessDevBus from "./bus"
import ProjectProcessDevController from "./controller"
import ProjectProcessDevService from "./service"
import ProjectProcessDevWsGateway from "./ws"

const ProjectProcessDev: ModuleMetadata = {
  controllers: [
    ProjectProcessDevController
  ],
  providers: [
    ProjectProcessDevService,
    ProjectProcessDevWsGateway,
    ProjectProcessDevBus
  ]
}

export default ProjectProcessDev