import { Global, Module } from "@nestjs/common"
import ConfigController from "./controller"
import ConfigService from "./service"

@Global()
@Module({
  controllers: [
    ConfigController
  ],
  providers: [
    ConfigService
  ],
  exports: [
    ConfigService
  ]
})
export default class ConfigModule {

}