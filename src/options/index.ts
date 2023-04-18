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
  constructor({ port, db, web, dev }: {
    port: number
    db: string
    web?: string
    dev?: boolean
  }) {
    if (Options._instance) {
      throw new Error("Options already initialized")
    }
    this.port = port
    this.db = db
    this.web = web
    this.isDev = dev || false
  }
}

