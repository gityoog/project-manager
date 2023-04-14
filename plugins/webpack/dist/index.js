"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_ipc_1 = __importDefault(require("@achrinza/node-ipc"));
class ProjectManagerWebpackPlugin {
    constructor(options) {
        this.options = options;
        this.name = 'ProjectManagerNoticePlugin';
        this.serverKey = 'PROJECT_MANAGER_IPC_SERVER';
        this.childKey = 'PROJECT_MANAGER_IPC_CHILD';
    }
    apply(compiler) {
        this.key = process.env[this.childKey];
        this.logger = compiler.getInfrastructureLogger(this.name);
        if (this.key) {
            this.server = process.env[this.serverKey] || this.serverKey; /** old version */
            node_ipc_1.default.config.id = this.key;
            node_ipc_1.default.config.retry = 10 * 1000;
            node_ipc_1.default.connectTo(this.server);
            node_ipc_1.default.config.logger = (msg) => {
                this.logger.debug(msg);
            };
            compiler.hooks.done.tap(this.name, (stats) => {
                if (stats.hasErrors()) {
                    this.fail(stats.toString());
                }
                else {
                    if (compiler.options.mode === 'production') {
                        const outPath = stats.toJson().outputPath;
                        if (outPath) {
                            this.complete(outPath);
                        }
                        else {
                            this.fail('outputPath is undefined');
                        }
                        node_ipc_1.default.disconnect(this.server);
                    }
                    else if (compiler.options.mode === 'development') {
                        if (this.options.devInfo) {
                            const { host, port } = this.options.devInfo();
                            this.url(host, port);
                        }
                    }
                }
            });
        }
        else {
            this.logger.warn(`env.${this.childKey} is not defined`);
        }
    }
    getClient() {
        if (!this.key || !node_ipc_1.default.of[this.server])
            throw new Error('ipc client is not connected');
        return node_ipc_1.default.of[this.server];
    }
    fail(message) {
        const client = this.getClient();
        client.emit('fail', {
            id: this.key,
            message
        });
    }
    complete(outPath) {
        const client = this.getClient();
        client.emit('dist', {
            id: this.key,
            path: outPath
        });
    }
    url(host, port) {
        const client = this.getClient();
        client.emit('url', {
            id: this.key,
            host,
            port
        });
    }
}
exports.default = ProjectManagerWebpackPlugin;
