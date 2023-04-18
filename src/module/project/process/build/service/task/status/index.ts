export default class BuildTaskStatus {
  private pty = false
  private zip = false
  private save = false

  get() {
    return this.pty || this.zip || this.save
  }

  canStop() {
    return !(this.zip || this.save)
  }

  setPty(value: boolean) {
    if (this.pty !== value) {
      this.pty = value
      this.update()
    }
  }
  setZip(value: boolean) {
    if (this.zip !== value) {
      this.zip = value
      this.update()
    }
  }
  setSave(value: boolean) {
    if (this.save !== value) {
      this.save = value
      this.update()
    }
  }
  private callback?: (status: boolean) => void
  onChange(callback: (status: boolean) => void) {
    this.callback = callback
  }
  private update() {
    this.callback?.(this.get())
  }

  destroy() {
    this.callback = undefined
  }
}