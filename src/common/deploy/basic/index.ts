export default abstract class DeployBasic {
  abstract run(file: Buffer, data: {
    version: string | null
  }): Promise<boolean>
  abstract stop(): Promise<boolean>
  abstract setOptions(options: Json): void
  protected beforeDestroy?(): void

  private callbacks: {
    start: (() => void)[]
    success: ((msg: string) => void)[]
    fail: ((msg: string) => void)[]
    progress: ((chunk: string) => void)[]
  } = {
      start: [],
      success: [],
      fail: [],
      progress: []
    }
  protected emitStart() {
    this.callbacks.start.forEach(callback => callback())
  }
  protected emitSuccess(msg: string) {
    this.callbacks.success.forEach(callback => callback(msg))
  }
  protected emitFail(msg: string) {
    this.callbacks.fail.forEach(callback => callback(msg))
  }
  protected emitProgress(chunk: string) {
    this.callbacks.progress.forEach(callback => callback(chunk))
  }
  onStart(callback: () => void) {
    this.callbacks.start.push(callback)
  }
  onSuccess(callback: (msg: string) => void) {
    this.callbacks.success.push(callback)
  }
  onFail(callback: (msg: string) => void) {
    this.callbacks.fail.push(callback)
  }
  onProgress(callback: (chunk: string) => void) {
    this.callbacks.progress.push(callback)
  }
  on(callback: {
    start?: () => void
    success?: (msg: string) => void
    fail?: (msg: string) => void
    progress?: (chunk: string) => void
  }) {
    callback.start && this.onStart(callback.start)
    callback.success && this.onSuccess(callback.success)
    callback.fail && this.onFail(callback.fail)
    callback.progress && this.onProgress(callback.progress)
  }
  destroy() {
    this.beforeDestroy?.()
  }
}