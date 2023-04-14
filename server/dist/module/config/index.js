"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const controller_1 = __importDefault(require("./controller"));
const service_1 = __importDefault(require("./service"));
const data_1 = __importDefault(require("./service/data"));
const entity_1 = __importDefault(require("./service/entity"));
let ConfigModule = class ConfigModule {
};
ConfigModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entity_1.default])
        ],
        controllers: [
            controller_1.default
        ],
        providers: [
            service_1.default,
            data_1.default
        ],
        exports: [
            service_1.default
        ]
    })
], ConfigModule);
exports.default = ConfigModule;
