"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const bus_1 = __importDefault(require("../bus"));
const nsRegx = /^\/project\/process\/build\/([a-f0-9\-]+?)$/;
let ProjectProcessBuildWsGateway = class ProjectProcessBuildWsGateway {
    handleConnection(socket) {
        const result = nsRegx.exec(socket.nsp.name);
        if (result) {
            const [_, room] = result;
            socket.join(room);
            this.logger.debug(`${socket.id} Join ${room}`, 'ProjectProcessBuildWsGateway');
        }
        else {
            this.logger.debug(`${socket.id} Has NoNRoom`, 'ProjectProcessBuildWsGateway');
        }
    }
    handleDisconnect(socket) {
        this.logger.debug(`${socket.id} Leave`, 'ProjectProcessBuildWsGateway');
    }
    afterInit(server) {
        this.bus.on((data) => {
            server.to(data.id).emit(data.action, data);
        });
    }
};
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", common_1.Logger)
], ProjectProcessBuildWsGateway.prototype, "logger", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", bus_1.default)
], ProjectProcessBuildWsGateway.prototype, "bus", void 0);
ProjectProcessBuildWsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: nsRegx
    })
], ProjectProcessBuildWsGateway);
exports.default = ProjectProcessBuildWsGateway;
