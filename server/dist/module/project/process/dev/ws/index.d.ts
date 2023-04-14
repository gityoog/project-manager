import { OnGatewayConnection, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
export default class ProjectProcessDevWsGateway implements OnGatewayInit, OnGatewayConnection {
    private logger;
    private bus;
    handleConnection(socket: Socket): void;
    afterInit(server: Server): void;
}
