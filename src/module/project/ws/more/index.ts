import { OnGatewayInit, WebSocketGateway } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import { Inject, Logger } from "@nestjs/common"
import ProjectBus from "../../bus"
import ProjectOutputBus from "../../ouput/bus"
import ProjectProcessBus from "../../process/bus"

const nsRegx = /^\/project\/more\/([a-f0-9\-]+?)$/

@WebSocketGateway({
  namespace: nsRegx
})
export default class ProjectMoreWsGateway implements OnGatewayInit {
  @Inject() private logger!: Logger
  @Inject() private bus!: ProjectBus
  @Inject() private output!: ProjectOutputBus
  @Inject() private process!: ProjectProcessBus

  afterInit(server: Server) {
    this.output.onAdd(row => {
      // todo
    })
  }
}
