import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import { Inject, Logger } from "@nestjs/common"
import ProjectProcessBuildBus from "../bus"

const nsRegx = /^\/project\/process\/build\/([a-f0-9\-]+?)$/

@WebSocketGateway({
  namespace: nsRegx
})
export default class ProjectProcessBuildWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @Inject() private logger!: Logger
  @Inject() private bus!: ProjectProcessBuildBus

  handleConnection(socket: Socket) {
    const result = nsRegx.exec(socket.nsp.name)
    if (result) {
      const [_, room] = result
      socket.join(room)
      this.logger.debug(`${socket.id} Join ${room}`, 'ProjectProcessBuildWsGateway')
    } else {
      this.logger.debug(`${socket.id} Has NoNRoom`, 'ProjectProcessBuildWsGateway')
    }
  }
  handleDisconnect(socket: Socket) {
    this.logger.debug(`${socket.id} Leave`, 'ProjectProcessBuildWsGateway')
  }
  afterInit(server: Server) {
    this.bus.on((data) => {
      server.to(data.id).emit(data.action, data)
    })
  }
}