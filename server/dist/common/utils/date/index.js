"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
function formatDate(date, format) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();
    return format
        .replace('YYYY', year.toString())
        .replace('MM', month.toString().padStart(2, '0'))
        .replace('DD', day.toString().padStart(2, '0'))
        .replace('HH', hour.toString().padStart(2, '0'))
        .replace('mm', minute.toString().padStart(2, '0'))
        .replace('ss', second.toString().padStart(2, '0'))
        .replace('SSS', millisecond.toString().padStart(3, '0'));
}
exports.formatDate = formatDate;
