import { APP_SESSION } from "@/service/session"
import { Inject, Injectable, Optional } from "@nestjs/common"
import { RequestHandler } from "@nestjs/common/interfaces"
import { IoAdapter } from "@nestjs/platform-socket.io"
import { MessageMappingProperties } from "@nestjs/websockets"
import { IncomingMessage } from "http"
import { CLS_REQ, ClsServiceManager } from "nestjs-cls"
import { Server, Socket } from "socket.io"

export interface WsConnectGraud {
  canActivate: (ctx: { socket: Socket }) => Promise<boolean> | boolean
}

@Injectable()
export default class WsIoAdapter extends IoAdapter {
  @Inject(APP_SESSION) private session!: RequestHandler

  private grauds: WsConnectGraud[] = []
  addConnectGraud(graud: WsConnectGraud) {
    this.grauds.push(graud)
  }

  protected httpServer!: Server
  setHttpServer(server: any) {
    this.httpServer = server
  }
  private async initCls(req: IncomingMessage) {
    const service = ClsServiceManager.getClsService()
    service.enter()
    service.set(CLS_REQ, req)
    await service.resolveProxyProviders()
  }
  override createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options)
    server.engine.use(this.session)
    return server
  }
  override bindClientConnect(server: unknown, callback: Function) {
    const self = this
    super.bindClientConnect(server, async function (this: unknown, socket: Socket) {
      await self.initCls(socket.request)
      for (const graud of self.grauds) {
        if (!await graud.canActivate({ socket })) {
          socket.disconnect()
          return
        }
      }
      return callback.apply(this, arguments)
    })
  }
  override bindClientDisconnect(client: Socket, callback: Function) {
    const self = this
    super.bindClientDisconnect(client, async function (this: unknown) {
      await self.initCls(client.request)
      return callback.apply(this, arguments)
    })
  }
  bindMessageHandlers(client: Socket, handlers: MessageMappingProperties[], transform: (data: any) => any) {
    const self = this
    handlers = handlers.map(handler => {
      const callback = handler.callback
      return {
        ...handler,
        callback: async function (this: object, ...args: any[]) {
          await self.initCls(client.request)
          return callback.apply(this, args)
        }
      }
    })
    return super.bindMessageHandlers(client, handlers, transform)
  }
}
