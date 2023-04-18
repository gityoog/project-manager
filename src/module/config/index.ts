import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import ConfigController from "./controller"
import ConfigService from "./service"
import ConfigData from "./service/data"
import ConfigEntity from "./service/entity"

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ConfigEntity])
  ],
  controllers: [
    ConfigController
  ],
  providers: [
    ConfigService,
    ConfigData
  ],
  exports: [
    ConfigService
  ]
})
export default class ConfigModule {

}