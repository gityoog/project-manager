"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const handler_1 = __importDefault(require("./handler"));
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
class EntityEmitter {
    constructor() {
        this.emitter = new events_1.default();
        this.removeHandlers = [];
    }
    add(row) {
        this.emitter.emit('Add', row);
    }
    onAdd(callback) {
        this.emitter.on('Add', callback);
        return () => {
            return this.emitter.off('Add', callback);
        };
    }
    update(row, origin) {
        this.emitter.emit('Update', row, origin);
    }
    onUpdate(callback) {
        this.emitter.on('Update', callback);
        return () => {
            return this.emitter.off('Update', callback);
        };
    }
    remove(row) {
        if (Array.isArray(row)) {
            row.forEach(row => this.emitter.emit('Remove', row));
        }
        else {
            this.emitter.emit('Remove', row);
        }
    }
    onRemove(callback) {
        this.emitter.on('Remove', callback);
        return () => {
            return this.emitter.off('Remove', callback);
        };
    }
    handle() {
        return new handler_1.default;
    }
    startRemove(row, manager, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const fn of this.removeHandlers) {
                yield fn(row, manager, (callback) => {
                    handler.add(callback);
                });
            }
        });
    }
    beforeRemove(callback) {
        this.removeHandlers.push(callback);
        return () => {
            const index = this.removeHandlers.indexOf(callback);
            if (index >= 0) {
                this.removeHandlers.splice(index, 1);
            }
        };
    }
    on(callback) {
        const off = [
            this.onAdd(row => callback('Add', row)),
            this.onUpdate((row, origin) => callback('Update', row, origin)),
            this.onRemove(row => callback('Remove', row)),
        ];
        return () => {
            off.forEach(fn => fn());
            off.splice(0, off.length);
        };
    }
    onChange(callback) {
        const rows = [];
        const fn = (0, lodash_debounce_1.default)(() => {
            callback(rows.splice(0, rows.length));
        }, 100);
        return this.on((_, row) => {
            rows.push(row);
            fn();
        });
    }
}
exports.default = EntityEmitter;
