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
const entity_emitter_1 = __importDefault(require("../../../../common/entity-emitter"));
const service_1 = __importDefault(require("../../../logging/service"));
const common_1 = require("@nestjs/common");
let ProjectCategoryBus = class ProjectCategoryBus extends entity_emitter_1.default {
    constructor(logging) {
        super();
        this.logging = logging;
        this.on((action, row) => {
            this.logging.save({
                action,
                target: 'ProjectCategory',
                description: `${row.name}`,
            });
        });
    }
};
ProjectCategoryBus = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_1.default])
], ProjectCategoryBus);
exports.default = ProjectCategoryBus;
