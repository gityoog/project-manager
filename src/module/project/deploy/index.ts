import { mergeModuleMetadata } from "@/common/module"
import ProjectDeployController from "./controller"
import ProjectDeployService from "./service"
import ProjectDeployBus from "./bus"


const ProjectDeploy = mergeModuleMetadata({
  providers: [
    ProjectDeployService,
    ProjectDeployBus
  ],
  controllers: [
    ProjectDeployController
  ],
  imports: []
})

export default ProjectDeploy