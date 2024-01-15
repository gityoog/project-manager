import { WsConnectGraud } from "@/module/websocket/adapter"
import UserStore from "@/service/user-store"
import { Inject, Injectable } from "@nestjs/common"
import { Socket } from "socket.io"

@Injectable()
export default class AppWSConnectGraud implements WsConnectGraud {
  @Inject() private user!: UserStore
  canActivate(ctx: { socket: Socket }) {
    if (!this.user.authorized) {
      return false
    }
    return true
  }
}