"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_pty_1 = require("node-pty");
const state_1 = __importDefault(require("./state"));
class NodePtyService {
    constructor(key, options = {}) {
        this.key = key;
        this.options = options;
        this.listeners = [];
        this.state = new state_1.default;
    }
    run({ command, cwd, shell, env }) {
        if (!this.process) {
            this.state.setStatus(true);
            this.process = (0, node_pty_1.spawn)(shell, command, {
                cwd,
                env: Object.assign(Object.assign(Object.assign({}, process.env), env), { PROJECT_MANAGER_IPC_CHILD: this.key }),
            });
            if (this.options.stats !== false) {
                this.state.activeStats(this.process.pid);
            }
            this.tip('start');
            this.listeners.push(this.process.onData(data => {
                this.state.writeStdout(data);
            }), this.process.onExit(({ exitCode, signal }) => {
                this.tip('exit', `exitCode: ${exitCode}, signal: ${signal || 'null'}`);
                this.clear();
            }));
        }
        return this.process.pid;
    }
    stop() {
        if (this.process) {
            this.tip('kill');
            this.clear();
        }
        return true;
    }
    info() {
        return this.state.get();
    }
    tip(name, detail) {
        this.state.writeStdout('\n' +
            `------${name}------` +
            (detail ? `\n${detail}\n------${name}------` : ''));
    }
    onStdoutPush(callback) {
        this.state.onStdoutPush(callback);
    }
    onStatusChange(callback) {
        this.state.onStatusChange(callback);
    }
    onStatsUpdate(callback) {
        this.state.onStatsUpdate(callback);
    }
    clear() {
        this.state.setStatus(false);
        this.state.clear();
        this.listeners.forEach(listener => listener.dispose());
        this.listeners = [];
        if (this.process) {
            this.process.destroy();
            this.process = undefined;
        }
    }
    destroy() {
        this.clear();
        this.state.destroy();
    }
}
exports.default = NodePtyService;
