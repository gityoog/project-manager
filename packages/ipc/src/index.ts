import ipc from '@achrinza/node-ipc'

export default class ProjectManagerIpc {
  private id
  private server
  constructor({ idKey = 'PROJECT_MANAGER_IPC_CHILD', serverKey = 'PROJECT_MANAGER_IPC_SERVER', log }: {
    idKey?: string
    serverKey?: string
    log?: (msg: string) => void
  } = {}) {
    this.id = process.env[idKey]
    this.server = process.env[serverKey] || serverKey
    if (log) {
      ipc.config.logger = log
    } else {
      ipc.config.logger = () => { }
    }
    ipc.config.retry = 10 * 1000
  }
  setLogger(log: (msg: string) => void) {
    ipc.config.logger = log
  }
  connect({ success, fail }: {
    success?: () => void
    fail?: (err: string) => void
  } = {}) {
    if (this.id) {
      ipc.config.id = this.id
      ipc.connectTo(this.server, () => {
        ipc.of[this.server].on('connect', () => {
          success?.()
        })
        ipc.of[this.server].on('error', (err) => {
          fail?.(err instanceof Error ? err.message : 'unknown error')
        })
      })
    } else {
      fail?.('child id is not defined')
    }
  }
  private getClient() {
    return ipc.of ? ipc.of[this.server] : undefined
  }
  emitUrl(host: string, port: number) {
    this.getClient()?.emit('url', {
      id: this.id,
      host,
      port
    })
  }
  emitDist(path: string) {
    this.getClient()?.emit('dist', {
      id: this.id,
      path
    })
  }
  emitError(message: string) {
    this.getClient()?.emit('fail', {
      id: this.id,
      message
    })
  }
  disconnect() {
    ipc.disconnect(this.server)
  }
  destroy() {
    this.disconnect()
  }
}