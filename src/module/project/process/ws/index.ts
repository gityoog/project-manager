import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import { Inject, Logger } from "@nestjs/common"
import ProjectProcessBus from "../bus"
import ProjectDeployBus from "../../deploy/bus"

const nsRegx = /^\/project\/process\/([a-f0-9\-]+?)$/

@WebSocketGateway({
  namespace: nsRegx
})
export default class ProjectProcessWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @Inject() private logger!: Logger
  @Inject() private bus!: ProjectProcessBus
  @Inject() private deploy!: ProjectDeployBus

  private dict: Record<string, string> = {}

  handleConnection(socket: Socket) {
    const result = nsRegx.exec(socket.nsp.name)
    if (result) {
      const [_, room] = result
      socket.join(room)
      this.dict[socket.id] = room
      this.logger.debug(`${socket.id} Join ${room}`, 'ProjectProcessWsGateway')
    } else {
      this.logger.debug(`${socket.id} Has NoNRoom`, 'ProjectProcessWsGateway')
    }
  }
  handleDisconnect(socket: Socket) {
    if (this.dict[socket.id]) {
      delete this.dict[socket.id]
    }
    this.logger.debug(`${socket.id} Leave`, 'ProjectProcessWsGateway')
  }
  afterInit(server: Server) {
    this.bus.on((data) => {
      server.to(data.id).emit(data.action, data)
    })
    this.deploy.on(data => {
      server.to(data.process).emit('deploy', data)
    })
  }

  @SubscribeMessage('stdin')
  handleStdin(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket
  ) {
    const id = this.dict[socket.id]
    if (id) {
      this.bus.stdin({ id, value: data })
    }
  }
}