#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option('port', { type: 'number', default: 4000, describe: 'The port to listen on' })
    .option('db', { type: 'string', default: './config/app.db', describe: 'The path to the database file' })
    .version()
    .help()
    .command('start', 'Start the server', yargs => yargs, (data) => {
    const web = path_1.default.resolve(__dirname, '../web');
    (0, __1.default)({
        port: data.port,
        db: path_1.default.resolve(process.cwd(), data.db),
        web: fs_1.default.existsSync(web) ? web : undefined
    });
})
    .usage('Usage: $0 <command> [options]')
    .strict(true)
    .parse();
