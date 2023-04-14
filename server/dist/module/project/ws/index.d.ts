import { OnGatewayInit } from "@nestjs/websockets";
import { Server } from 'socket.io';
export default class ProjectWsGateway implements OnGatewayInit {
    private logger;
    private bus;
    afterInit(server: Server): void;
}
