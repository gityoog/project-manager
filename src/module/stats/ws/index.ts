import { Inject, Logger } from "@nestjs/common"
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import StatsService from "../service"

@WebSocketGateway({
  namespace: '/stats'
})
export default class StatsWsGateway implements OnGatewayInit {
  @WebSocketServer() private server!: Server
  @Inject() private stats!: StatsService
  @Inject() private logger!: Logger
  afterInit(server: Server) {
    this.stats.onData(data => {
      server.emit('stats', data)
    })
  }
  handleConnection(socket: Socket) {
    this.logger.debug(`${socket.id} Connection`, 'StatsWsGateway')
    this.update()
  }
  handleDisconnect(socket: Socket) {
    this.logger.debug(`${socket.id} Disconnect`, 'StatsWsGateway')
    this.update()
  }
  private index = 0
  async update() {
    const index = ++this.index
    const sockets = await this.server.fetchSockets()
    if (index !== this.index) return
    if (sockets.length > 0) {
      this.stats.start()
    } else {
      this.stats.stop()
    }
  }
}