"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("@nestjs/typeorm");
const bus_1 = __importDefault(require("./bus"));
const controller_1 = __importDefault(require("./controller"));
const service_1 = __importDefault(require("./service"));
const entity_1 = __importDefault(require("./service/entity"));
const ws_1 = __importDefault(require("./ws"));
const ProjectCategory = {
    controllers: [
        controller_1.default
    ],
    providers: [
        service_1.default,
        ws_1.default,
        bus_1.default
    ],
    imports: [
        typeorm_1.TypeOrmModule.forFeature([
            entity_1.default
        ])
    ]
};
exports.default = ProjectCategory;
