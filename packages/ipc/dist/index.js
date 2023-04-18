"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_ipc_1 = __importDefault(require("@achrinza/node-ipc"));
class ProjectManagerIpc {
    constructor({ id, idKey = 'PROJECT_MANAGER_IPC_CHILD', serverKey = 'PROJECT_MANAGER_IPC_SERVER', log } = {}) {
        this.id = id || process.env[idKey];
        this.server = process.env[serverKey] || serverKey;
        if (log) {
            node_ipc_1.default.config.logger = log;
        }
        node_ipc_1.default.config.retry = 10 * 1000;
    }
    setLogger(log) {
        node_ipc_1.default.config.logger = log;
    }
    connect({ success, fail }) {
        if (this.id) {
            node_ipc_1.default.config.id = this.id;
            node_ipc_1.default.connectTo(this.server, () => {
                node_ipc_1.default.of[this.server].on('connect', () => {
                    success === null || success === void 0 ? void 0 : success();
                });
                node_ipc_1.default.of[this.server].on('error', (err) => {
                    fail === null || fail === void 0 ? void 0 : fail(err instanceof Error ? err.message : 'unknown error');
                });
            });
        }
        else {
            fail === null || fail === void 0 ? void 0 : fail('child id is not defined');
        }
    }
    getClient() {
        if (!this.id || !node_ipc_1.default.of[this.server])
            throw new Error('ipc client is not connected');
        return node_ipc_1.default.of[this.server];
    }
    emitUrl(host, port) {
        this.getClient().emit('url', {
            id: this.id,
            host,
            port
        });
    }
    emitDist(path) {
        this.getClient().emit('dist', {
            id: this.id,
            path
        });
    }
    emitError(message) {
        this.getClient().emit('fail', {
            id: this.id,
            message
        });
    }
    destroy() {
        node_ipc_1.default.disconnect(this.server);
    }
}
exports.default = ProjectManagerIpc;
