"use strict";
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
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const options_1 = __importDefault(require("./options"));
const module_1 = __importDefault(require("./module"));
function ProjectManagerServer(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = options_1.default.default(...args);
        const app = yield core_1.NestFactory.create(module_1.default, new platform_express_1.ExpressAdapter);
        app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
        return yield app.listen(config.port);
    });
}
exports.default = ProjectManagerServer;
