"use strict";
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
                    const outPath = stats.toJson().outputPath;
                    if (outPath) {
                        this.ipc.emitDist(outPath);
                    }
                    else {
                        this.ipc.emitError('outputPath is undefined');
                    }
                    this.ipc.destroy();
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
}
exports.default = ProjectManagerWebpackPlugin;
