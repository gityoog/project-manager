import { Inject, Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AppAuthGuard } from "./guard"
import WsIoAdapter from "../websocket/adapter"
import AppWSConnectGraud from "./ws"

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard
    },
    AppWSConnectGraud
  ]
})
export default class AuthModule {
  @Inject() private io!: WsIoAdapter
  @Inject() private ws!: AppWSConnectGraud

  onModuleInit() {
    this.io.addConnectGraud(this.ws)
  }
}