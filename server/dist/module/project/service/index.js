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
const entity_2 = __importDefault(require("../category/service/entity"));
const bus_1 = __importDefault(require("../bus"));
const bus_2 = __importDefault(require("../category/bus"));
let ProjectService = class ProjectService {
    constructor(main, category, dataSource, bus, categoryBus) {
        this.main = main;
        this.category = category;
        this.dataSource = dataSource;
        this.bus = bus;
        this.categoryBus = categoryBus;
        this.categoryBus.beforeRemove((row, manager, onFinish) => __awaiter(this, void 0, void 0, function* () {
            const origins = yield this.main.find({ where: { type: row.id } });
            const projects = [];
            for (const origin of origins) {
                const row = yield manager.save(this.main.merge(this.main.create(origin), { type: null }));
                projects.push({ row, origin });
            }
            onFinish(() => {
                projects.forEach(({ row, origin }) => {
                    this.bus.update(row, origin);
                });
            });
        }));
    }
    query(data) {
        return this.main.find({
            where: {
                type: data.type === null ? (0, typeorm_2.IsNull)() : data.type
            },
            order: {
                sort: 'ASC'
            }
        });
    }
    detail(id) {
        return this.main.findOne({
            where: { id }
        });
    }
    save(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, dto), { id: dto.id === '' ? undefined : dto.id, type: dto.type && (yield this.category.exist({ where: { id: dto.type } })) ? dto.type : null });
            if (data.id) {
                const origin = yield this.main.findOneOrFail({ where: { id: data.id } });
                const row = yield this.main.save(data);
                this.bus.update(row, origin);
                return row;
            }
            else {
                const row = yield this.main.save(data);
                this.bus.add(row);
                return row;
            }
        });
    }
    remove(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.main.findBy({ id: (0, typeorm_2.In)('id' in data ? [data.id] : data.ids) });
            const origins = rows.map(row => this.main.create(row));
            const handler = this.bus.handle();
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const row of rows) {
                    yield this.bus.startRemove(row, manager, handler);
                    yield manager.remove(row);
                }
            }));
            yield handler.finish();
            this.bus.remove(origins);
            return true;
        });
    }
};
ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.default)),
    __param(1, (0, typeorm_1.InjectRepository)(entity_2.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        bus_1.default,
        bus_2.default])
], ProjectService);
exports.default = ProjectService;
