import path from 'path'
import fs from 'fs'
import { Logger } from '@nestjs/common'

export default class Options {
  private static _instance: Options
  static default(...args: ConstructorParameters<typeof Options>) {
    return this._instance = new this(...args)
  }
  static factory(logger: Logger) {
    if (!this._instance) {
      throw new Error("Options not initialized")
    }
    this._instance.logger = logger
    return this._instance
  }
  port
  db
  web?: string | Buffer
  isDev
  output: string
  password
  get bak() {
    return this.db + '.bak'
  }
  constructor({ port, db, web, dev, output, password }: {
    port: number
    db: string
    web?: string | Buffer
    dev?: boolean
    output?: string
    password?: string
  }) {
    if (Options._instance) {
      throw new Error("Options already initialized")
    }
    this.port = port
    this.db = db
    this.web = web
    this.isDev = dev || false
    this.output = output || path.resolve(process.cwd(), 'config/output')
    this.password = password
    if (!fs.existsSync(this.output)) {
      fs.mkdirSync(this.output, { recursive: true })
    }
    const dbDir = path.dirname(this.db)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
  }
  private logger!: Logger
  private dbCache?: Uint8Array
  hasPassword() {
    return !!this.password
  }
  getDB(): Uint8Array {
    const bak = fs.existsSync(this.bak) ? Uint8Array.from(fs.readFileSync(this.bak)) : undefined
    const db = fs.existsSync(this.db) ? Uint8Array.from(fs.readFileSync(this.db)) : undefined
    if (db) {
      if (db.length === 0 && bak) {
        return bak
      }
      return db
    }
    if (bak) {
      return bak
    }
    this.logger.warn(`db file not found: ${this.db}`, 'GetDBFile')
    return new Uint8Array()
  }
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
    this.writeFile(Buffer.from(data), (err) => {
      if (err) {
        this.logger.warn(`save db failed: ${err.message}`, 'SaveDBFile')
        if (!this.dbCache) {
          this.dbCache = data
        }
      } else {
        this.logger.debug(`save db success`, 'SaveDBFile')
      }
      setTimeout(() => {
        this.writing = false
        this.writeDB()
      }, 500)
    })
  }
  private writeFile(data: Buffer, callback: (err: Error | null) => void) {
    fs.writeFile(this.bak, data, (err) => {
      if (err) {
        return callback(err)
      }
      fs.writeFile(this.db, data, err => {
        callback(err)
      })
    })
  }
}

