"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let SQLExceptionFilter = class SQLExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const result = /UNIQUE constraint failed: (.+?)\.(.*?)$/.exec(exception.message);
        if (result) {
            response.status(200).json({
                status: 0,
                msg: `${result[2]}重复`
            });
        }
        else {
            response.status(200).json({
                status: 0,
                msg: exception.name
            });
        }
    }
};
SQLExceptionFilter = __decorate([
    (0, common_1.Catch)(typeorm_1.QueryFailedError)
], SQLExceptionFilter);
exports.default = SQLExceptionFilter;
