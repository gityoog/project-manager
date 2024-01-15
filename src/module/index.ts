import { Global, Inject, Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import Options from "@/options"
import EncodeJSONInterceptor from "@/interceptor/encode-json"
import AppExceptionFilter from "@/filter/exception"
import ProjectModule from './project'
import LoggingModule from "./logging"
import { ClsMiddleware, ClsModule } from "nestjs-cls"
import UserStore from "@/service/user-store"
import session from "express-session"
import { APP_SESSION } from "@/service/session"
import { TypeormStore } from "connect-typeorm"
import { DataSource } from 'typeorm'
import { Request, RequestHandler } from "express"
import { ServeStaticModule } from '@nestjs/serve-static'
import ConfigModule from "./config"
import { SessionEntity } from "./session/service/entity"
import ZipStaticModule from "./zip-static"
import StatsModule from "./stats"
import WebsocketsModule from "./websocket"
import UserModule from "./user"
import AuthModule from "./auth"

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      proxyProviders: [UserStore]
    }),
    TypeOrmModule.forRootAsync({
      inject: [Options],
      useFactory: (options: Options) => ({
        type: 'sqljs',
        driver: require('sql.js'),
        sqlJsConfig: {
          wasmBinary: options.isDev ? undefined : require('sql.js/dist/sql-wasm.wasm')
        },
        database: options.getDB(),
        autoSaveCallback: (data: Uint8Array) => options.saveDB(data),
        autoSave: true,
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    TypeOrmModule.forFeature([
      SessionEntity
    ]),
    ProjectModule,
    LoggingModule,
    ConfigModule,
    ZipStaticModule,
    StatsModule,
    WebsocketsModule,
    UserModule,
    AuthModule,
    ServeStaticModule.forRootAsync({
      inject: [Options],
      useFactory: (options: Options) => typeof options.web === 'string' ? [{
        rootPath: options.web,
      }] : []
    })
  ],
  providers: [
    Logger,
    {
      provide: Options,
      inject: [Logger],
      useFactory: (logger: Logger) => Options.factory(logger)
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: EncodeJSONInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    },
    {
      provide: APP_SESSION,
      inject: [DataSource],
      useFactory: (db: DataSource) => session({
        secret: 'app',
        resave: true,
        saveUninitialized: true,
        store: new TypeormStore({
          cleanupLimit: 2,
          limitSubquery: true,
          ttl: 86400
        }).connect(db.getRepository(SessionEntity))
      })
    }
  ],
  exports: [Options, Logger, APP_SESSION]
})
export default class AppModule implements NestModule {
  constructor(
    @Inject(APP_SESSION) private session: RequestHandler,
    private db: DataSource
  ) {
    this.db.query('VACUUM')
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.session, ClsMiddleware)
      .forRoutes('*')
  }
}