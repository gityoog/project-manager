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
const bus_1 = __importDefault(require("../../../bus"));
const service_1 = __importDefault(require("../../../service"));
const common_1 = require("@nestjs/common");
const node_ipc_1 = __importDefault(require("../../node-ipc"));
const bus_2 = __importDefault(require("../bus"));
const task_1 = __importDefault(require("./task"));
let ProjectProcessDevService = class ProjectProcessDevService {
    constructor(bus, project, projectBus, ipc) {
        this.bus = bus;
        this.project = project;
        this.projectBus = projectBus;
        this.ipc = ipc;
        this.data = {};
        this.keyDict = {};
        this.init();
    }
    run(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.project.detail(id);
            if (row) {
                const task = this.factory(row);
                return task.run();
            }
            return false;
        });
    }
    stop(id) {
        var _a;
        (_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.stop();
    }
    info(id) {
        var _a;
        return (_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.info();
    }
    init() {
        this.projectBus.onRemove(({ id }) => {
            const task = this.data[id];
            if (task) {
                task.destroy();
                delete this.data[id];
                delete this.keyDict[task.key];
            }
        });
        this.ipc.on('url', data => {
            const task = this.keyDict[data.id];
            if (task) {
                task.setUrl({
                    host: data.host,
                    port: data.port
                });
            }
        });
    }
    factory(project) {
        const id = project.id;
        const task = this.data[id];
        if (!task) {
            const task = new task_1.default({
                project,
                bus: this.bus
            });
            this.data[id] = task;
            this.keyDict[task.key] = task;
            return task;
        }
        return task;
    }
    get(id) {
        return this.data[id];
    }
};
ProjectProcessDevService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bus_2.default,
        service_1.default,
        bus_1.default,
        node_ipc_1.default])
], ProjectProcessDevService);
exports.default = ProjectProcessDevService;
