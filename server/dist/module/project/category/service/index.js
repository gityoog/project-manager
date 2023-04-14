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
const entity_2 = __importDefault(require("../../service/entity"));
const bus_1 = __importDefault(require("../bus"));
let ProjectCategoryService = class ProjectCategoryService {
    constructor(main, project, dataSource, bus) {
        this.main = main;
        this.project = project;
        this.dataSource = dataSource;
        this.bus = bus;
    }
    query() {
        return __awaiter(this, void 0, void 0, function* () {
            const other = yield this.project.exist({ where: { type: (0, typeorm_2.IsNull)() } });
            const data = yield this.main.createQueryBuilder()
                .orderBy(`CASE 
        WHEN sort IS NULL THEN 0
        WHEN sort = '' THEN 0
        ELSE sort
      END`, 'DESC')
                .getMany();
            return { data, other };
        });
    }
    save(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, dto), { id: dto.id === '' ? undefined : dto.id });
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
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.main.findOneOrFail({ where: { id: id } });
            const origin = this.main.create(row);
            const handler = this.bus.handle();
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield this.bus.startRemove(row, manager, handler);
                yield manager.remove(row);
            }));
            yield handler.finish();
            this.bus.remove(origin);
            return true;
        });
    }
};
ProjectCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.default)),
    __param(1, (0, typeorm_1.InjectRepository)(entity_2.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        bus_1.default])
], ProjectCategoryService);
exports.default = ProjectCategoryService;
