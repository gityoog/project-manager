"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stats_1 = __importDefault(require("./stats"));
class PtyState {
    constructor() {
        this.stdout = [];
        this.status = false;
        this.stats = new stats_1.default;
    }
    activeStats(pid) {
        if (pid) {
            this.stats.start(pid);
        }
        else {
            this.stats.stop();
        }
    }
    get() {
        return {
            status: this.status,
            stdout: this.stdout,
            stats: this.stats.getData()
        };
    }
    onStatsUpdate(callback) {
        this.stats.onUpdate(callback);
    }
    writeStdout(data) {
        var _a;
        this.stdout.push(data);
        if (this.stdout.length > 10) {
            this.stdout.shift();
        }
        (_a = this.stdoutCallback) === null || _a === void 0 ? void 0 : _a.call(this, data);
    }
    onStdoutPush(callback) {
        this.stdoutCallback = callback;
    }
    setStatus(status) {
        var _a;
        if (this.status !== status) {
            this.status = status;
            (_a = this.statusChange) === null || _a === void 0 ? void 0 : _a.call(this, this.status);
        }
    }
    onStatusChange(callback) {
        this.statusChange = callback;
    }
    clear() {
        this.stats.stop();
        this.setStatus(false);
    }
    destroy() {
        this.stdout = [];
        this.stats.destroy();
        this.stdoutCallback = undefined;
        this.statusChange = undefined;
    }
}
exports.default = PtyState;
