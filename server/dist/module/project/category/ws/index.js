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
let ProjectCategoryWsGateway = class ProjectCategoryWsGateway {
    afterInit(server) {
        this.bus.on((action, row, origin) => {
            server.emit(action, row, origin);
            this.logger.debug(`Emit ${action} ${row.name}`, 'ProjectCategoryWsGateway');
        });
    }
};
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", common_1.Logger)
], ProjectCategoryWsGateway.prototype, "logger", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", bus_1.default)
], ProjectCategoryWsGateway.prototype, "bus", void 0);
ProjectCategoryWsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/project/category'
    })
], ProjectCategoryWsGateway);
exports.default = ProjectCategoryWsGateway;
