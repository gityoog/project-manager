type type = 'running' | 'success' | 'failed'
type callback = (data: {
  type: type
  msg: string
  actived: string
}) => void
export default class ProjectDeployTaskStatus {
  output = ''
  type: type = 'success'
  msg = ''

  active(output: string) {
    this.output = output
  }

  start() {
    this.msg = ''
    this.setType('running')
  }

  success(msg: string) {
    this.msg = msg
    this.setType('success')
  }

  fail(msg: string) {
    this.msg = msg
    this.setType('failed')
  }

  progress(msg: string) {
    this.msg = msg
    this.setType('running')
  }

  isBusy() {
    return this.type === 'running'
  }

  info() {
    return {
      type: this.type,
      msg: this.msg,
      actived: this.output
    }
  }
  private callbacks: Array<callback> = []
  on(callback: callback) {
    this.callbacks.push(callback)
  }
  private setType(type: type) {
    this.type = type
    this.callbacks.forEach(callback => callback(this.info()))
  }
  destroy() {
    this.callbacks = []
  }
}