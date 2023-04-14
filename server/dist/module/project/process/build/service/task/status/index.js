"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BuildTaskStatus {
    constructor() {
        this.pty = false;
        this.zip = false;
        this.save = false;
    }
    get() {
        return this.pty || this.zip || this.save;
    }
    canStop() {
        return !(this.zip || this.save);
    }
    setPty(value) {
        if (this.pty !== value) {
            this.pty = value;
            this.update();
        }
    }
    setZip(value) {
        if (this.zip !== value) {
            this.zip = value;
            this.update();
        }
    }
    setSave(value) {
        if (this.save !== value) {
            this.save = value;
            this.update();
        }
    }
    onChange(callback) {
        this.callback = callback;
    }
    update() {
        var _a;
        (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, this.get());
    }
    destroy() {
        this.callback = undefined;
    }
}
exports.default = BuildTaskStatus;
