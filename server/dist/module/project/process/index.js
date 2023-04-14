"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../../../common/module");
const build_1 = __importDefault(require("./build"));
const dev_1 = __importDefault(require("./dev"));
const node_ipc_1 = __importDefault(require("./node-ipc"));
const ProjectProcess = (0, module_1.mergeModuleMetadata)({
    providers: [
        node_ipc_1.default
    ],
}, dev_1.default, build_1.default);
exports.default = ProjectProcess;
