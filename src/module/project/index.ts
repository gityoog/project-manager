import ProjectController from "./controller"
import ProjectService from "./service"
import ProjectEntity from "./service/entity"
import { TypeOrmModule } from '@nestjs/typeorm'
import ProjectWsGateway from "./ws"
import ProjectBus from "./bus"
import ProjectCategory from "./category"
import { mergeModuleMetadata } from "@/common/module"
import ProjectProcess from "./process"
import { Module } from "@nestjs/common"
import ProjectOutput from "./ouput"

const ProjectMeta = {
  controllers: [
    ProjectController
  ],
  providers: [
    ProjectService,
    ProjectWsGateway,
    ProjectBus
  ],
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity
    ])
  ]
}

@Module(mergeModuleMetadata(ProjectMeta, ProjectCategory, ProjectProcess, ProjectOutput))
export default class ProjectModule {

}