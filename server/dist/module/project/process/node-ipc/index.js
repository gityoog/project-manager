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
const node_ipc_1 = __importDefault(require("@achrinza/node-ipc"));
const common_1 = require("@nestjs/common");
let NodeIpcService = class NodeIpcService {
    constructor(logger) {
        this.inited = false;
        node_ipc_1.default.config.id = 'PROJECT_MANAGER_IPC_SERVER';
        node_ipc_1.default.config.retry = 1500;
        node_ipc_1.default.config.logger = msg => logger.verbose(msg.replaceAll('\n', '\\n'), 'NodeIpcService');
        node_ipc_1.default.serve();
    }
    init() {
        if (!this.inited) {
            this.inited = true;
            node_ipc_1.default.server.start();
        }
    }
    on(event, callback) {
        this.init();
        node_ipc_1.default.server.on(event, callback);
    }
    off(event, callback) {
        node_ipc_1.default.server.off(event, callback);
    }
};
NodeIpcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_1.Logger])
], NodeIpcService);
exports.default = NodeIpcService;
