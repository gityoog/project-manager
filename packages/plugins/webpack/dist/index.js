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
const project_manager_ipc_1 = __importDefault(require("project-manager-ipc"));
class ProjectManagerWebpackPlugin {
    constructor(options) {
        this.options = options;
        this.name = 'ProjectManagerNoticePlugin';
        this.ipc = new project_manager_ipc_1.default();
    }
    apply(compiler) {
        this.logger = compiler.getInfrastructureLogger(this.name);
        this.ipc.connect({});
        this.ipc.setLogger(msg => {
            this.logger.debug(msg);
        });
        compiler.hooks.done.tap(this.name, (stats) => {
            if (stats.hasErrors()) {
                this.ipc.emitError(stats.toString());
            }
            else {
                if (compiler.options.mode === 'production') {
                    this.outFile(stats);
                }
                else if (compiler.options.mode === 'development') {
                    if (this.options.devInfo) {
                        const { host, port } = this.options.devInfo();
                        this.ipc.emitUrl(host, port);
                    }
                }
            }
        });
    }
    outFile(stats) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const outPath = stats.toJson().outputPath;
            if (outPath) {
                this.ipc.emitDist(outPath, yield ((_b = (_a = this.options).distInfo) === null || _b === void 0 ? void 0 : _b.call(_a)));
            }
            else {
                this.ipc.emitError('outputPath is undefined');
            }
            this.ipc.destroy();
        });
    }
}
exports.default = ProjectManagerWebpackPlugin;
