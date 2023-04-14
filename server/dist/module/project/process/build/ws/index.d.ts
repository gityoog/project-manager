import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
export default class ProjectProcessBuildWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger;
    private bus;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    afterInit(server: Server): void;
}
