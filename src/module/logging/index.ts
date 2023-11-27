import { Global, Module } from "@nestjs/common"
import LoggingController from "./controller"
import LoggingService from "./service"
import LoggingEntity from "./service/entity"
import { TypeOrmModule } from '@nestjs/typeorm'
import LoggingContext from "@/common/logging"

@Global()
@Module({
  controllers: [
    LoggingController
  ],
  providers: [
    LoggingService,
    LoggingContext
  ],
  imports: [
    TypeOrmModule.forFeature([LoggingEntity]),
  ],
  exports: [
    LoggingService,
    LoggingContext
  ]
})
export default class LoggingModule {

}