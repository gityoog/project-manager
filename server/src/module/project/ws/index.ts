import { OnGatewayInit, WebSocketGateway } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import { Inject, Logger } from "@nestjs/common"
import ProjectBus from "../bus"

@WebSocketGateway({
  namespace: '/project'
})
export default class ProjectWsGateway implements OnGatewayInit {
  @Inject() private logger!: Logger
  @Inject() private bus!: ProjectBus
  afterInit(server: Server) {
    this.bus.on((action, row, origin) => {
      server.emit(action, row, origin)
      this.logger.debug(`Emit ${action} ${row.name}`, 'ProjectWsGateway')
    })
  }
}