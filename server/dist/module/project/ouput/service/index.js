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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bus_1 = __importDefault(require("../../bus"));
const bus_2 = __importDefault(require("../bus"));
const entity_1 = __importDefault(require("./entity"));
let ProjectOutputService = class ProjectOutputService {
    constructor(main, projectBus, bus) {
        this.main = main;
        this.projectBus = projectBus;
        this.bus = bus;
        this.projectBus.beforeRemove((row, manager, onFinish) => __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.main.findBy({ project: row.id });
            yield manager.remove(rows);
            onFinish(() => this.bus.remove(rows));
        }));
    }
    query(project) {
        return this.main.find({
            select: ['id', 'name', 'size', 'created_at'],
            where: { project },
            order: { created_at: 'DESC' }
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.main.findOneByOrFail({ id });
            const origin = this.main.create(row);
            yield this.main.remove(row);
            this.bus.remove(origin);
            return origin;
        });
    }
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.main.findOneBy({ id });
            return data;
        });
    }
    save({ project, name, content }) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = new entity_1.default();
            entity.project = project;
            entity.name = name;
            entity.content = content;
            const length = content.length;
            entity.size = `${(length / 1024 / 1024).toFixed(2)}MB`;
            const row = yield this.main.save(entity);
            this.bus.add(row);
            return row;
        });
    }
};
ProjectOutputService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bus_1.default,
        bus_2.default])
], ProjectOutputService);
exports.default = ProjectOutputService;
