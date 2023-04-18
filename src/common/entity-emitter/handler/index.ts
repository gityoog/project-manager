export default class EntityEmitterHanlder {
  private callbacks: Array<() => Promise<void> | void> = []
  add(callback: () => Promise<void> | void) {
    this.callbacks.push(callback)
  }
  async finish() {
    for (const fn of this.callbacks) {
      await fn()
    }
    this.callbacks = []
  }
}