import { Global, Inject, Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import Options from "@/options"
import EncodeJSONInterceptor from "@/interceptor/encode-json"
import HttpExceptionFilter from "@/filter/http-exception"
import ProjectModule from './project'
import SQLExceptionFilter from "@/filter/sql-exception"
import LoggingModule from "./logging"
import { ClsModule } from "nestjs-cls"
import UserStore from "@/service/user-store"
import session from "express-session"
import { APP_SESSION } from "@/service/session"
import { TypeormStore } from "connect-typeorm"
import { DataSource } from 'typeorm'
import { Request, RequestHandler } from "express"
import { Socket } from 'socket.io'
import { ServeStaticModule } from '@nestjs/serve-static'
import ConfigModule from "./config"
import { SessionEntity } from "./session/service/entity"

@Global()
@Module({
  imports: [
    ClsModule.forRootAsync({
      global: true,
      proxyProviders: [UserStore],
      inject: [Logger],
      useFactory: (logger: Logger) => ({
        interceptor: {
          mount: true,
          setup: (cls, context) => {
            if (context.getType() === 'http') {
              const request = context.switchToHttp().getRequest<Request>()
              cls.set('request', request)
              cls.set('token', request.headers.token)
              // logger.debug(`cls init ${context.getType()}(${request.url})`, 'ClsModule')
            } else if (context.getType() === 'ws') {
              const socket = context.switchToWs().getClient<Socket>()
              cls.set('request', socket.request)
              cls.set('token', socket.handshake.query.token)
              // logger.debug(`cls init ${context.getType()}`, 'ClsModule')
            } else {
              logger.debug(`cls init ${context.getType()}`, 'ClsModule')
            }
          }
        }
      })
    }),
    TypeOrmModule.forRootAsync({
      inject: [Options],
      useFactory: (options: Options) => ({
        type: 'sqljs',
        driver: require('sql.js/dist/sql-wasm.js'),
        location: options.db,
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
    ServeStaticModule.forRootAsync({
      inject: [Options],
      useFactory: (options: Options) => options.web ? [{
        rootPath: options.web,
      }] : []
    })
  ],
  providers: [
    Logger,
    {
      provide: Options,
      useFactory: () => Options.factory()
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: EncodeJSONInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: SQLExceptionFilter
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
      .apply(this.session)
      .forRoutes('*')
  }
}