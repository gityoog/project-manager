import { Global, Logger, Module } from "@nestjs/common"
import LoggingController from "./controller"
import LoggingService from "./service"
import LoggingEntity from "./service/entity"
import { TypeOrmModule } from '@nestjs/typeorm'

@Global()
@Module({
  controllers: [
    LoggingController
  ],
  providers: [
    LoggingService
  ],
  imports: [
    TypeOrmModule.forFeature([LoggingEntity]),
  ],
  exports: [
    LoggingService
  ]
})
export default class LoggingModule {

}