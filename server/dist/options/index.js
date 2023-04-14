"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Options {
    static default(...args) {
        return this._instance = new this(...args);
    }
    static factory() {
        if (!this._instance) {
            throw new Error("Options not initialized");
        }
        return this._instance;
    }
    constructor({ port, db, web }) {
        if (Options._instance) {
            throw new Error("Options already initialized");
        }
        this.port = port;
        this.db = db;
        this.web = web;
    }
}
exports.default = Options;
