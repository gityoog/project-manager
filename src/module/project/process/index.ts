import { mergeModuleMetadata } from "@/common/module"
import ProjectProcessBus from "./bus"
import ProjectProcessController from "./controller"
import NodeIpcService from "./node-ipc"
import ProjectProcessService from "./service"
import ProjectProcessWsGateway from "./ws"
import ProjectProcessState from "./state"

const ProjectProcess = mergeModuleMetadata({
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
}, ProjectProcessState)

export default ProjectProcess