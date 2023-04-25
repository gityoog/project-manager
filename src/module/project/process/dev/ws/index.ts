import { OnGatewayConnection, OnGatewayInit, WebSocketGateway, OnGatewayDisconnect } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import { Inject, Logger } from "@nestjs/common"
import ProjectProcessDevBus from "../bus"

const nsRegx = /^\/project\/process\/dev\/([a-f0-9\-]+?)$/

@WebSocketGateway({
  namespace: nsRegx
})
export default class ProjectProcessDevWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @Inject() private logger!: Logger
  @Inject() private bus!: ProjectProcessDevBus

  handleConnection(socket: Socket) {
    const result = nsRegx.exec(socket.nsp.name)
    if (result) {
      const [_, room] = result
      socket.join(room)
      this.logger.debug(`${socket.id} Join ${room}`, 'ProjectProcessDevWsGateway')
    } else {
      this.logger.debug(`${socket.id} Has NoNRoom`, 'ProjectProcessDevWsGateway')
    }
  }
  handleDisconnect(socket: Socket) {
    this.logger.debug(`${socket.id} Leave`, 'ProjectProcessDevWsGateway')
  }
  afterInit(server: Server) {
    this.bus.on((data) => {
      server.to(data.id).emit(data.action, data)
    })
  }
}