import webpack from 'webpack'
import Logger from './logger'

export default class ProcessPlugin {
  private options: { process: boolean }
  constructor({ process = true, logger }: { process?: boolean, logger?: Logger } = {}) {
    this.logger = logger || new Logger()
    this.options = {
      process
    }
  }
  private name = 'ProcessPlugin'
  private done = false
  private logger
  apply(compiler: webpack.Compiler) {
    if (this.options.process) {
      new webpack.ProgressPlugin(
        (percent, msg, module) => {
          if (!this.done) {
            this.logger.process(
              (percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || '')
            )
          }
        }
      ).apply(compiler)
    }
    compiler.hooks.compile.tap(this.name, () => {
      this.done = false
      this.logger.status('Building ...')
    })
    compiler.hooks.done.tap(this.name, stats => {
      this.done = true
      if (stats.hasErrors()) {
        this.logger.other(stats.toString({
          all: false,
          errors: true,
          colors: true
        }))
        this.logger.status('Build failed with errors.')
      } else {
        if (stats.hasWarnings()) {
          this.logger.other(stats.toString({
            all: false,
            errors: true,
            warnings: true,
            colors: true
          }))
        } else {
          this.logger.other("")
        }
        this.logger.status('Build success. \nTime: ' + stats.toJson().time + ' ms')
      }
    })
  }
}