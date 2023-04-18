import { mergeModuleMetadata } from "@/common/module"
import ProjectProcessBuild from "./build"
import ProjectProcessDev from "./dev"
import NodeIpcService from "./node-ipc"

const ProjectProcess = mergeModuleMetadata(
  {
    providers: [
      NodeIpcService
    ],
  },
  ProjectProcessDev,
  ProjectProcessBuild
)

export default ProjectProcess