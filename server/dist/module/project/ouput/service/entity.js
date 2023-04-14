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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("../../../../common/typeorm");
const typeorm_2 = require("typeorm");
let ProjectOutputEntity = class ProjectOutputEntity extends typeorm_2.BaseEntity {
};
__decorate([
    (0, typeorm_2.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectOutputEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'text', unique: false }),
    __metadata("design:type", String)
], ProjectOutputEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ProjectOutputEntity.prototype, "project", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'blob' }),
    __metadata("design:type", Buffer)
], ProjectOutputEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ProjectOutputEntity.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumnWithFormat)(),
    __metadata("design:type", Date)
], ProjectOutputEntity.prototype, "created_at", void 0);
ProjectOutputEntity = __decorate([
    (0, typeorm_2.Entity)()
], ProjectOutputEntity);
exports.default = ProjectOutputEntity;
