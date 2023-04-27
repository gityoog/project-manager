import { Inject, Service } from "ioc-di"
import { webpack } from "webpack"
import fs from 'fs'
import path from 'path'
import WebProjectOptions from "../options"
import WebProjectConfig from "../config"
import ProjectManagerIpc from 'project-manager-ipc'

@Service()
export default class WebProjectBuilder {
  @Inject() private options!: WebProjectOptions
  @Inject() private config!: WebProjectConfig
  @Inject() private ipc!: ProjectManagerIpc

  async run() {
    this.ipc.connect()
    this.options.setProdMode()
    webpack(this.config.getConfig(), (err, stats) => {
      if (err || !stats) throw new Error(err?.message || 'Unknown error')
      if (stats.hasErrors()) {
        this.ipc.emitError('Build failed')
      } else {
        fs.writeFileSync(path.resolve(this.options.outPath, `${this.options.version}.info`), stats.toString({
          colors: false
        }).replace(/\n/g, '\r\n'))
        this.ipc.emitDist(this.options.outPath)
      }
      this.ipc.disconnect()
    })
  }
}