import { OnGatewayInit } from "@nestjs/websockets";
import { Server } from 'socket.io';
export default class ProjectCategoryWsGateway implements OnGatewayInit {
    private logger;
    private bus;
    afterInit(server: Server): void;
}
