"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const options_1 = __importDefault(require("../options"));
const encode_json_1 = __importDefault(require("../interceptor/encode-json"));
const http_exception_1 = __importDefault(require("../filter/http-exception"));
const project_1 = __importDefault(require("./project"));
const sql_exception_1 = __importDefault(require("../filter/sql-exception"));
const logging_1 = __importDefault(require("./logging"));
const nestjs_cls_1 = require("nestjs-cls");
const user_store_1 = __importDefault(require("../service/user-store"));
const express_session_1 = __importDefault(require("express-session"));
const session_1 = require("../service/session");
const better_sqlite3_session_store_1 = __importDefault(require("better-sqlite3-session-store"));
const typeorm_2 = require("typeorm");
const serve_static_1 = require("@nestjs/serve-static");
const config_1 = __importDefault(require("./config"));
let AppModule = class AppModule {
    constructor(session, db) {
        this.session = session;
        this.db = db;
        this.db.query('VACUUM');
    }
    configure(consumer) {
        consumer
            .apply(this.session)
            .forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nestjs_cls_1.ClsModule.forRootAsync({
                global: true,
                proxyProviders: [user_store_1.default],
                inject: [common_1.Logger],
                useFactory: (logger) => ({
                    interceptor: {
                        mount: true,
                        setup: (cls, context) => {
                            if (context.getType() === 'http') {
                                const request = context.switchToHttp().getRequest();
                                cls.set('request', request);
                                cls.set('token', request.headers.token);
                                // logger.debug(`cls init ${context.getType()}(${request.url})`, 'ClsModule')
                            }
                            else if (context.getType() === 'ws') {
                                const socket = context.switchToWs().getClient();
                                cls.set('request', socket.request);
                                cls.set('token', socket.handshake.query.token);
                                // logger.debug(`cls init ${context.getType()}`, 'ClsModule')
                            }
                            else {
                                logger.debug(`cls init ${context.getType()}`, 'ClsModule');
                            }
                        }
                    }
                })
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [options_1.default],
                useFactory: (options) => ({
                    type: 'better-sqlite3',
                    autoLoadEntities: true,
                    database: options.db,
                    synchronize: true
                })
            }),
            project_1.default,
            logging_1.default,
            config_1.default,
            serve_static_1.ServeStaticModule.forRootAsync({
                inject: [options_1.default],
                useFactory: (options) => options.web ? [{
                        rootPath: options.web,
                    }] : []
            })
        ],
        providers: [
            common_1.Logger,
            {
                provide: options_1.default,
                useFactory: () => options_1.default.factory()
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: encode_json_1.default
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_1.default
            },
            {
                provide: core_1.APP_FILTER,
                useClass: sql_exception_1.default
            },
            {
                provide: session_1.APP_SESSION,
                inject: [typeorm_2.DataSource],
                useFactory: (db) => (0, express_session_1.default)({
                    secret: 'app',
                    resave: false,
                    saveUninitialized: true,
                    store: new ((0, better_sqlite3_session_store_1.default)(express_session_1.default))({
                        client: db.driver.databaseConnection,
                        expired: {
                            clear: true,
                            intervalMs: 1000 * 60 * 60 * 24 // 1 day
                        }
                    })
                })
            }
        ],
        exports: [options_1.default, common_1.Logger, session_1.APP_SESSION]
    }),
    __param(0, (0, common_1.Inject)(session_1.APP_SESSION)),
    __metadata("design:paramtypes", [Function, typeorm_2.DataSource])
], AppModule);
exports.default = AppModule;
