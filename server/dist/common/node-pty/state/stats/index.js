"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const pidusage_1 = __importDefault(require("pidusage"));
const process_tree_1 = __importDefault(require("process-tree"));
class PtyUsageStats {
    constructor() {
        this.cores = os_1.default.cpus().length;
        this.index = 0;
        this.running = false;
        this.data = null;
    }
    getData() {
        return this.data;
    }
    setData(data) {
        var _a;
        this.data = data;
        (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, this.data);
    }
    onUpdate(callback) {
        this.callback = callback;
    }
    start(pid) {
        this.running = true;
        const index = ++this.index;
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.query(pid, (err, stats) => {
            if (err)
                return console.log(err);
            if (index !== this.index)
                return;
            if (!this.running)
                return;
            this.setData(stats || null);
            this.timeout = setTimeout(() => this.start(pid), 1000);
        });
    }
    query(pid, callback) {
        (0, process_tree_1.default)(pid, (err, children) => {
            if (err)
                return callback(err);
            const pids = [];
            while (children.length) {
                const child = children.shift();
                if (child) {
                    children = children.concat(child.children);
                    pids.push(child.pid);
                }
            }
            if (pids.length === 0)
                return callback(null, undefined);
            (0, pidusage_1.default)(pids, (err, stats) => {
                if (err)
                    return callback(err);
                const data = Object.values(stats).reduce((total, cur) => ({
                    cpu: total.cpu + cur.cpu,
                    memory: total.memory + cur.memory,
                }), { cpu: 0, memory: 0 });
                callback(null, {
                    cpu: (data.cpu / this.cores).toFixed(2) + '%',
                    memory: (data.memory / 1024 / 1024).toFixed(2) + 'MB'
                });
            });
        });
    }
    stop() {
        this.running = false;
        this.setData(null);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }
    destroy() {
        this.stop();
        this.callback = undefined;
    }
}
exports.default = PtyUsageStats;
