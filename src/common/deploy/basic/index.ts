export default abstract class DeployBasic {
  abstract run(file: Buffer, data: {
    version: string | null
  }): Promise<boolean>
  abstract stop(): Promise<boolean>
  abstract setOptions(options: Json): void
  protected beforeDestroy?(): void

  private callbacks: {
    start: (() => void)[]
    success: (() => void)[]
    fail: ((msg: string) => void)[]
  } = {
      start: [],
      success: [],
      fail: []
    }
  protected emitStart() {
    this.callbacks.start.forEach(callback => callback())
  }
  protected emitSuccess() {
    this.callbacks.success.forEach(callback => callback())
  }
  protected emitFail(msg: string) {
    this.callbacks.fail.forEach(callback => callback(msg))
  }
  onStart(callback: () => void) {
    this.callbacks.start.push(callback)
  }
  onSuccess(callback: () => void) {
    this.callbacks.success.push(callback)
  }
  onFail(callback: (msg: string) => void) {
    this.callbacks.fail.push(callback)
  }
  on(callback: {
    start?: () => void
    success?: () => void
    fail?: (msg: string) => void
  }) {
    callback.start && this.onStart(callback.start)
    callback.success && this.onSuccess(callback.success)
    callback.fail && this.onFail(callback.fail)
  }
  destroy() {
    this.beforeDestroy?.()
  }
}