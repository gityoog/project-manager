import { Global, Module } from "@nestjs/common"
import WsIoAdapter from "./adapter"

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    WsIoAdapter
  ],
  exports: [
    WsIoAdapter
  ]
})
export default class WebsocketsModule {

}