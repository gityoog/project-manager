"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
class EncodeJSONInterceptor {
    intercept(context, next) {
        return next
            .handle()
            .pipe((0, operators_1.map)(item => ({
            status: 1,
            info: item === undefined ? null : item
        })));
    }
}
exports.default = EncodeJSONInterceptor;
