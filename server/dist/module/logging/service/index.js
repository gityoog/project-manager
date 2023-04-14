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
const common_1 = require("@nestjs/common");
const entity_1 = __importDefault(require("./entity"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_store_1 = __importDefault(require("../../../service/user-store"));
let LoggingService = class LoggingService {
    constructor(main, logger, user) {
        this.main = main;
        this.logger = logger;
        this.user = user;
    }
    query({ page = 1, size = 10, params = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data, total] = yield this.main.findAndCount({
                where: params,
                skip: (page - 1) * size,
                take: size,
                order: {
                    time: 'DESC'
                }
            });
            return {
                data, total, page
            };
        });
    }
    save(data) {
        this.logger.log(`${data.action} {${this.user.ip}} ${data.description}`, data.target);
        this.main.save({
            action: data.action,
            target: data.target,
            description: data.description,
            ip: this.user.ip,
            user: this.user.name
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.main.clear();
            this.save({
                target: 'Logging',
                action: 'Clear',
                description: 'Clear all logs'
            });
        });
    }
};
LoggingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        common_1.Logger,
        user_store_1.default])
], LoggingService);
exports.default = LoggingService;
