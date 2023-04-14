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
let ProjectCategoryController = class ProjectCategoryController {
    constructor(project) {
        this.project = project;
    }
    query() {
        return this.project.query();
    }
    save(data) {
        return this.project.save(data);
    }
    remove({ id }) {
        return this.project.remove(id);
    }
    removes(projects) {
        return Promise.all(projects.map(project => this.project.remove(project.id)));
    }
};
__decorate([
    (0, common_1.All)('/query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectCategoryController.prototype, "query", null);
__decorate([
    (0, common_1.All)('/save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.default]),
    __metadata("design:returntype", void 0)
], ProjectCategoryController.prototype, "save", null);
__decorate([
    (0, common_1.All)('/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectCategoryController.prototype, "remove", null);
__decorate([
    (0, common_1.All)('/removes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ProjectCategoryController.prototype, "removes", null);
ProjectCategoryController = __decorate([
    (0, common_1.Controller)('/project/category'),
    __param(0, (0, common_1.Inject)(service_1.default)),
    __metadata("design:paramtypes", [service_1.default])
], ProjectCategoryController);
exports.default = ProjectCategoryController;
