"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_pty_1 = __importDefault(require("../../../../../../common/node-pty"));
const zip_local_1 = __importDefault(require("zip-local"));
const status_1 = __importDefault(require("./status"));
const nestjs_cls_1 = require("nestjs-cls");
class BuildTaskService {
    constructor({ project, bus, output, logging }) {
        this.status = new status_1.default();
        this.project = project;
        this.bus = bus;
        this.logging = logging;
        this.output = output;
        this.key = `build_${project.id}`;
        this.pty = new node_pty_1.default(this.key, { stats: false });
        this.status.onChange(status => {
            this.bus.emit({ id: this.project.id, action: 'status', value: status });
        });
        this.pty.onStatusChange(status => {
            this.status.setPty(status);
        });
        this.pty.onStdoutPush(data => {
            this.bus.emit({
                id: this.project.id,
                action: 'stdout',
                value: data,
            });
        });
        this.clsStore = nestjs_cls_1.ClsServiceManager.getClsService().get();
    }
    save(outpath) {
        nestjs_cls_1.ClsServiceManager.getClsService().enterWith(this.clsStore);
        this.status.setZip(true);
        this.pty.tip('ziping', outpath);
        zip_local_1.default.zip(outpath, (err, zipped) => {
            this.status.setZip(false);
            if (err) {
                return this.pty.tip('zipfail', err.message);
            }
            this.pty.tip('saving');
            this.status.setSave(true);
            this.output.save({
                project: this.project.id,
                name: this.project.name,
                content: zipped.memory()
            }).then(() => {
                this.pty.tip('success');
            }).catch((e) => {
                this.pty.tip('fail', e instanceof Error ? e.message : 'unknown error');
            }).finally(() => {
                this.status.setSave(false);
            });
        });
    }
    info() {
        return {
            status: this.status.get(),
            stdout: this.pty.info().stdout
        };
    }
    run(shell) {
        if (!this.project.build) {
            return false;
        }
        const pid = this.pty.run({
            shell,
            command: this.project.build,
            cwd: this.project.context,
        });
        this.logging.save({
            target: 'BuildProcess',
            action: 'Run',
            description: `${this.project.name}: ${pid}`
        });
        return pid;
    }
    stop() {
        if (this.status.canStop()) {
            this.logging.save({
                target: 'BuildProcess',
                action: 'Stop',
                description: `${this.project.name}`
            });
            return this.pty.stop();
        }
        return false;
    }
    destroy() {
        this.pty.destroy();
        this.status.destroy();
        this.clsStore = null;
        this.bus = null;
        this.project = null;
        this.output = null;
    }
}
exports.default = BuildTaskService;
