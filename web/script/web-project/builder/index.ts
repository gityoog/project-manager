import { Inject, Service } from "ioc-di"
import { webpack } from "webpack"
import fs from 'fs'
import path from 'path'
import WebProjectOptions from "../options"
import WebProjectConfig from "../config"

@Service()
export default class WebProjectBuilder {
  @Inject() private options!: WebProjectOptions
  @Inject() private config!: WebProjectConfig

  async run() {
    this.options.setProdMode()
    webpack(this.config.getConfig(), (err, stats) => {
      if (err || !stats) throw new Error(err?.message || 'Unknown error')
      if (stats.hasErrors()) {

      } else {
        fs.writeFileSync(path.resolve(this.options.outPath, `${this.options.version}.info`), stats.toString({
          colors: false
        }).replace(/\n/g, '\r\n'))
      }
    })
  }
}