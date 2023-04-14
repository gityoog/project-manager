"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonNullableColumn = exports.CreateDateColumnWithFormat = exports.UpdateDateColumnWithFormat = void 0;
const typeorm_1 = require("typeorm");
function UpdateDateColumnWithFormat(options) {
    return (0, typeorm_1.UpdateDateColumn)(Object.assign(Object.assign({}, options), { transformer: [{
                to: (value) => value,
                from: (value) => value.toLocaleString(),
            }].concat((options === null || options === void 0 ? void 0 : options.transformer) || []) }));
}
exports.UpdateDateColumnWithFormat = UpdateDateColumnWithFormat;
function CreateDateColumnWithFormat(options) {
    return (0, typeorm_1.CreateDateColumn)(Object.assign(Object.assign({}, options), { transformer: [{
                to: (value) => value,
                from: (value) => value.toLocaleString(),
            }].concat((options === null || options === void 0 ? void 0 : options.transformer) || []) }));
}
exports.CreateDateColumnWithFormat = CreateDateColumnWithFormat;
function NonNullableColumn(options) {
    return (0, typeorm_1.Column)(Object.assign(Object.assign({}, options), { transformer: [{
                to: (value) => value ? value : undefined,
                from: (value) => value,
            }].concat((options === null || options === void 0 ? void 0 : options.transformer) || []) }));
}
exports.NonNullableColumn = NonNullableColumn;
