import path from 'path'
import fs from 'fs'

export default class Options {
  private static _instance: Options
  static default(...args: ConstructorParameters<typeof Options>) {
    return this._instance = new this(...args)
  }
  static factory() {
    if (!this._instance) {
      throw new Error("Options not initialized")
    }
    return this._instance
  }
  port
  db
  web?: string
  isDev
  output: string
  constructor({ port, db, web, dev, output }: {
    port: number
    db: string
    web?: string
    dev?: boolean
    output?: string
  }) {
    if (Options._instance) {
      throw new Error("Options already initialized")
    }
    this.port = port
    this.db = db
    this.web = web
    this.isDev = dev || false
    this.output = output || path.resolve(process.cwd(), 'output')
    if (!fs.existsSync(this.output)) {
      fs.mkdirSync(this.output, { recursive: true })
    }
  }
}

