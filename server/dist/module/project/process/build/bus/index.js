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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bus_1 = __importDefault(require("../../../ouput/bus"));
const common_1 = require("@nestjs/common");
let ProjectProcessBuildBus = class ProjectProcessBuildBus {
    constructor(output) {
        this.output = output;
        this.callbacks = [];
        this.output.onChange((rows) => {
            const projects = new Set();
            rows.forEach(row => projects.add(row.project));
            projects.forEach(project => this.emit({ id: project, action: 'new' }));
        });
    }
    emit(data) {
        this.callbacks.forEach(callback => callback(data));
    }
    on(callback) {
        this.callbacks.push(callback);
        return () => {
            const index = this.callbacks.indexOf(callback);
            if (index > -1) {
                this.callbacks.splice(index, 1);
            }
        };
    }
};
ProjectProcessBuildBus = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bus_1.default])
], ProjectProcessBuildBus);
exports.default = ProjectProcessBuildBus;
