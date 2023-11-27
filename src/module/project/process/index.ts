import ProjectProcessBus from "./bus"
import ProjectProcessController from "./controller"
import NodeIpcService from "./node-ipc"
import ProjectProcessService from "./service"
import ProjectProcessWsGateway from "./ws"

const ProjectProcess = {
  providers: [
    NodeIpcService,
    ProjectProcessService,
    ProjectProcessBus,
    ProjectProcessWsGateway
  ],
  controllers: [
    ProjectProcessController
  ],
  imports: []
}

export default ProjectProcess