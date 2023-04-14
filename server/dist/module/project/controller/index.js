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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const service_1 = __importDefault(require("../service"));
const dto_1 = __importDefault(require("../service/dto"));
let ProjectController = class ProjectController {
    constructor(project) {
        this.project = project;
    }
    query(data) {
        return this.project.query(data);
    }
    save(data) {
        return this.project.save(data);
    }
    remove(data) {
        return this.project.remove(data);
    }
};
__decorate([
    (0, common_1.All)('/query'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "query", null);
__decorate([
    (0, common_1.All)('/save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.default]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "save", null);
__decorate([
    (0, common_1.All)('/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "remove", null);
ProjectController = __decorate([
    (0, common_1.Controller)('/project'),
    __param(0, (0, common_1.Inject)(service_1.default)),
    __metadata("design:paramtypes", [service_1.default])
], ProjectController);
exports.default = ProjectController;
