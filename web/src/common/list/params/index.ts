export default class Params<T = any> {
  data
  private value!: T
  private onDone
  constructor({ data, onDone }: { data: T, onDone(): void }) {
    this.onDone = onDone
    this.data = data
    this.update()
  }
  private update() {
    this.value = { ...this.data }
  }
  done() {
    this.update()
    this.onDone()
  }
  setValue(data: Partial<T>) {
    this.data = { ...this.data, ...data }
    this.done()
  }
  getValue() {
    return this.value
  }
  destroy() {
    this.onDone = undefined!
    this.data = null!
    this.value = null!
  }
}