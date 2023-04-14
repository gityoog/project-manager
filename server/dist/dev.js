"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const path_1 = __importDefault(require("path"));
(0, _1.default)({
    port: 4000,
    db: path_1.default.resolve(process.cwd(), './config/app.db')
});
