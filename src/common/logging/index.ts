export default class LoggingContext {
  private successCallback: ((name: string, action: string, description?: string) => void)[] = []
  private failCallback: ((name: string, action: string, description?: string) => void)[] = []

  success(name: string, action: string, description?: string) {
    this.successCallback.forEach(fn => fn(name, action, description))
  }
  fail(name: string, action: string, description?: string) {
    this.failCallback.forEach(fn => fn(name, action, description))
  }
  onSuccess(callback: (name: string, action: string, description?: string) => void) {
    this.successCallback.push(callback)
  }
  onFail(callback: (name: string, action: string, description?: string) => void) {
    this.failCallback.push(callback)
  }
}