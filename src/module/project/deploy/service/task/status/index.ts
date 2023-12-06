
enum Status {
  success = 0,
  failed = 1,
  running = 2
}

export default class ProjectDeployTaskStatus {
  output: string = ''
  status = Status.success
  msg = ''

  active(output: string) {
    this.output = output
  }

  start() {
    this.status = Status.running
  }

  success() {
    this.status = Status.success
  }

  fail(msg: string) {
    this.status = Status.failed
    this.msg = msg
  }

  isBusy() {
    return this.status === Status.running
  }

  info() {
    return {
      status: this.status,
      msg: this.msg,
      actived: this.output
    }
  }
  private callbacks: {
    start: (() => void)[]
    success: (() => void)[]
    fail: ((msg: string) => void)[]
  } = {
      start: [],
      success: [],
      fail: []
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
  onStart(callback: () => void) {
    this.callbacks.start.push(callback)
  }
  onSuccess(callback: () => void) {
    this.callbacks.success.push(callback)
  }
  onFail(callback: (msg: string) => void) {
    this.callbacks.fail.push(callback)
  }
  destroy() {

  }
}