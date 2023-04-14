"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const EntityNotFoundError_1 = require("typeorm/error/EntityNotFoundError");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            response.status(exception.getStatus()).json({
                status: 0,
                msg: exception.message
                //, stack: exception.stack
            });
        }
        // else if (exception instanceof IKnownException) {
        //   response.status(
        //     200
        //   ).json({
        //     status: 0,
        //     msg: exception.message
        //   })
        // }
        else if (exception instanceof EntityNotFoundError_1.EntityNotFoundError) {
            response.status(200).json({
                status: 0,
                msg: '数据不存在: ' + exception.message
            });
        }
        else if (exception instanceof Error) {
            response.status(500).json({
                status: 0,
                msg: exception.message,
                stack: exception.stack
            });
            console.error(exception.stack);
        }
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
exports.default = HttpExceptionFilter;
