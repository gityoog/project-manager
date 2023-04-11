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
  constructor({ port, db }: {
    port: number
    db: string
  }) {
    if (Options._instance) {
      throw new Error("Options already initialized")
    }
    this.port = port
    this.db = db
  }
}

