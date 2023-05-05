import path from 'path'
import fs from 'fs'
import { Logger } from '@nestjs/common'

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
  web?: string | Buffer
  isDev
  output: string
  constructor({ port, db, web, dev, output }: {
    port: number
    db: string
    web?: string | Buffer
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
    this.output = output || path.resolve(process.cwd(), 'config/output')
    if (!fs.existsSync(this.output)) {
      fs.mkdirSync(this.output, { recursive: true })
    }
  }
  private logger?: Logger
  setLogger(logger: Logger) {
    this.logger = logger
  }
  private dbCache?: Uint8Array
  saveDB(data: Uint8Array) {
    this.dbCache = data
    this.writeDB()
  }
  private writing = false
  private writeDB() {
    if (this.writing || !this.dbCache) {
      return
    }
    this.writing = true
    const data = this.dbCache
    this.dbCache = undefined
    fs.writeFile(this.db, data, (err) => {
      if (err) {
        this.logger?.log(`save db failed: ${err.message}`, 'SaveDBFile')
        if (!this.dbCache) {
          this.dbCache = data
        }
      }
      setTimeout(() => {
        this.writing = false
        this.writeDB()
      }, 500)
    })
  }
}

