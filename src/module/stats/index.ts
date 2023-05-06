import { Module } from "@nestjs/common"
import StatsService from "./service"
import StatsWsGateway from "./ws"

@Module({
  imports: [],
  controllers: [],
  providers: [
    StatsService,
    StatsWsGateway
  ],
  exports: []
})
export default class StatsModule {

}