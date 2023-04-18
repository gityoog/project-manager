import { OnGatewayInit, WebSocketGateway } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import { Inject, Logger } from "@nestjs/common"
import ProjectCategoryBus from "../bus"

@WebSocketGateway({
  namespace: '/project/category'
})
export default class ProjectCategoryWsGateway implements OnGatewayInit {
  @Inject() private logger!: Logger
  @Inject() private bus!: ProjectCategoryBus
  afterInit(server: Server) {
    this.bus.on((action, row, origin) => {
      server.emit(action, row, origin)
      this.logger.debug(`Emit ${action} ${row.name}`, 'ProjectCategoryWsGateway')
    })
  }
}