"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_pty_1 = __importDefault(require("../../../../../../common/node-pty"));
class DevTaskService {
    constructor({ project, bus, logging }) {
        this.url = null;
        this.project = project;
        this.bus = bus;
        this.logging = logging;
        this.key = `dev_${project.id}`;
        this.pty = new node_pty_1.default(this.key);
        this.pty.onStatusChange(status => {
            this.bus.emit({
                id: this.project.id,
                action: 'status',
                value: status,
            });
        });
        this.pty.onStdoutPush(data => {
            this.bus.emit({
                id: this.project.id,
                action: 'stdout',
                value: data,
            });
        });
        this.pty.onStatsUpdate(stats => {
            this.bus.emit({
                id: this.project.id,
                action: 'stats',
                value: stats,
            });
        });
    }
    setUrl(url) {
        if (this.url !== url) {
            this.url = url;
            this.bus.emit({
                id: this.project.id,
                action: 'url',
                value: url,
            });
        }
    }
    info() {
        return {
            pty: this.pty.info(),
            url: this.url
        };
    }
    run(shell) {
        if (!this.project.dev) {
            return false;
        }
        const pid = this.pty.run({
            shell,
            command: this.project.dev,
            cwd: this.project.context,
        });
        this.logging.save({
            target: 'DevProcess',
            action: 'Run',
            description: `${this.project.name}: ${pid}`
        });
        return pid;
    }
    stop() {
        this.setUrl(null);
        this.logging.save({
            target: 'DevProcess',
            action: 'Stop',
            description: `${this.project.name}`
        });
        return this.pty.stop();
    }
    destroy() {
        this.pty.destroy();
        this.bus = null;
        this.project = null;
    }
}
exports.default = DevTaskService;
