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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_1 = require("../../../../common/utils/date");
const common_1 = require("@nestjs/common");
const service_1 = __importDefault(require("../service"));
let ProjectOutputController = class ProjectOutputController {
    constructor(service) {
        this.service = service;
    }
    query({ project }) {
        return this.service.query(project);
    }
    remove({ id }) {
        return this.service.remove(id);
    }
    download({ id }, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.service.read(id);
            if (!file) {
                response.sendStatus(404);
                return;
            }
            response.attachment(file.name + (0, date_1.formatDate)(file.created_at, 'YYYYMMDDHHmmss') + '.zip');
            response.send(file.content);
        });
    }
    clear() {
        return this.service.clear();
    }
};
__decorate([
    (0, common_1.All)('/query'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectOutputController.prototype, "query", null);
__decorate([
    (0, common_1.All)('/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectOutputController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/download'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectOutputController.prototype, "download", null);
__decorate([
    (0, common_1.All)('/clear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectOutputController.prototype, "clear", null);
ProjectOutputController = __decorate([
    (0, common_1.Controller)('/project/output'),
    __metadata("design:paramtypes", [service_1.default])
], ProjectOutputController);
exports.default = ProjectOutputController;
