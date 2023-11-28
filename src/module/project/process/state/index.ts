import ProjectProcessStateService from "./service"
import ProjectProcessStateEntity from "./service/entity"
import { TypeOrmModule } from '@nestjs/typeorm'

const ProjectProcessState = {
  providers: [
    ProjectProcessStateService
  ],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([
      ProjectProcessStateEntity
    ])
  ]
}

export default ProjectProcessState