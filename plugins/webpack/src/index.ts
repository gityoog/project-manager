import { Compiler } from 'webpack'

import ipc from '@achrinza/node-ipc'

export default class ProjectManagerWebpackPlugin {
  private name = 'ProjectManagerNoticePlugin'
  private server = 'PROJECT_MANAGER_IPC_SERVER'
  private child = 'PROJECT_MANAGER_IPC_CHILD'
  private key?: string
  private logger!: {
    error(...args: any[]): void
    warn(...args: any[]): void
    info(...args: any[]): void
    log(...args: any[]): void
    debug(...args: any[]): void
  }
  constructor(private options: {
    devInfo?: () => { host: string, port: number }
  }) { }
  apply(compiler: Compiler) {
    this.key = process.env[this.child]
    this.logger = compiler.getInfrastructureLogger(this.name)
    if (this.key) {
      ipc.config.id = this.key
      ipc.config.retry = 10 * 1000
      ipc.connectTo(this.server)
      ipc.config.logger = (msg) => {
        this.logger.debug(msg)
      }
      compiler.hooks.done.tap(this.name, (stats) => {
        if (stats.hasErrors()) {
          this.fail(stats.toString())
        } else {
          if (compiler.options.mode === 'production') {
            const outPath = stats.toJson().outputPath
            if (outPath) {
              this.complete(outPath)
            } else {
              this.fail('outputPath is undefined')
            }
            ipc.disconnect(this.server)
          } else if (compiler.options.mode === 'development') {
            if (this.options.devInfo) {
              const { host, port } = this.options.devInfo()
              this.url(host, port)
            }
          }
        }
      })
    } else {
      this.logger.warn(`env.${this.child} is not defined`)
    }
  }

  private getClient() {
    if (!this.key || !ipc.of[this.server]) throw new Error('ipc client is not connected')
    return ipc.of[this.server]
  }

  private fail(message: string) {
    const client = this.getClient()
    client.emit('fail', {
      id: this.key,
      message
    })
  }

  private complete(outPath: string) {
    const client = this.getClient()
    client.emit('dist', {
      id: this.key,
      path: outPath
    })
  }

  private url(host: string, port: number) {
    const client = this.getClient()
    client.emit('url', {
      id: this.key,
      host,
      port
    })
  }
}