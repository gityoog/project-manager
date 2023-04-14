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
const os_1 = __importDefault(require("os"));
const entity_1 = __importDefault(require("../entity"));
const service_1 = __importDefault(require("../../../logging/service"));
let ConfigData = class ConfigData {
    constructor(main, logging) {
        this.main = main;
        this.logging = logging;
        this.data = {
            shell: {
                name: 'shell',
                default: () => os_1.default.platform() === 'win32' ? 'cmd.exe /C' : 'sh -c'
            }
        };
        this.cache = {};
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.data[key];
            yield this.save(item.name, value);
            this.cache[key] = value;
            this.logging.save({
                target: 'Config',
                action: 'Set',
                description: `${item.name}: ${value}`
            });
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(key in this.cache)) {
                const item = this.data[key];
                const row = yield this.main.findOneBy({ name: item.name });
                if (row) {
                    this.cache[key] = row.value;
                }
                else {
                    const value = item.default();
                    yield this.save(item.name, value);
                    this.cache[key] = value;
                }
            }
            return this.cache[key];
        });
    }
    save(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.main.findOneBy({ name });
            if (row) {
                yield this.main.save(this.main.merge(row, { value }));
            }
            else {
                yield this.main.save({ name, value });
            }
        });
    }
};
ConfigData = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        service_1.default])
], ConfigData);
exports.default = ConfigData;
