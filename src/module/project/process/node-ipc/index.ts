import Options from "@/options"
import ipc from "@achrinza/node-ipc"
import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export default class NodeIpcService {
  private childKey = 'PROJECT_MANAGER_IPC_CHILD'
  private serverKey = 'PROJECT_MANAGER_IPC_SERVER'
  constructor(
    logger: Logger,
    options: Options
  ) {
    ipc.config.id = options.isDev ? 'PROJECT_MANAGER_IPC_SERVER_DEV' : 'PROJECT_MANAGER_IPC_SERVER'
    ipc.config.retry = 1500
    ipc.config.logger = msg => logger.verbose(msg.replaceAll('\n', '\\n'), 'NodeIpcService')
    ipc.serve()
  }
  private inited = false
  private init() {
    if (!this.inited) {
      this.inited = true
      ipc.server.start()
    }
  }
  on(event: 'url', callback: (data: { id: string, host: string, port: string }) => void): void
  on(event: 'dist', callback: (data: { id: string, path: string }) => void): void
  on(event: string, callback: (data: any) => void) {
    this.init()
    ipc.server.on(event, callback)
  }
  off(event: string, callback: (data: any) => void) {
    ipc.server.off(event, callback)
  }
  env(key: string) {
    return {
      [this.childKey]: key,
      [this.serverKey]: ipc.config.id
    }
  }
}