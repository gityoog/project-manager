import { Compiler } from 'webpack'

import ProjectManagerIpc from 'project-manager-ipc'

export default class ProjectManagerWebpackPlugin {
  private name = 'ProjectManagerNoticePlugin'
  private logger!: {
    error(...args: any[]): void
    warn(...args: any[]): void
    info(...args: any[]): void
    log(...args: any[]): void
    debug(...args: any[]): void
  }
  private ipc = new ProjectManagerIpc()
  constructor(private options: {
    devInfo?: () => { host: string, port: number }
  }) { }
  apply(compiler: Compiler) {
    this.logger = compiler.getInfrastructureLogger(this.name)
    this.ipc.connect({})
    this.ipc.setLogger(msg => {
      this.logger.debug(msg)
    })
    compiler.hooks.done.tap(this.name, (stats) => {
      if (stats.hasErrors()) {
        this.ipc.emitError(stats.toString())
      } else {
        if (compiler.options.mode === 'production') {
          const outPath = stats.toJson().outputPath
          if (outPath) {
            this.ipc.emitDist(outPath)
          } else {
            this.ipc.emitError('outputPath is undefined')
          }
          this.ipc.destroy()
        } else if (compiler.options.mode === 'development') {
          if (this.options.devInfo) {
            const { host, port } = this.options.devInfo()
            this.ipc.emitUrl(host, port)
          }
        }
      }
    })
  }
}