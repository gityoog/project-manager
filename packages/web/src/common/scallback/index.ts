export default class SCallback<T extends (...args: any[]) => any = () => void> {
  private callbacks: T[] = []
  private onceCallbacks: T[] = []
  constructor(callback?: T) {
    if (callback) {
      this.add(callback)
    }
  }
  set(callback: T) {
    this.clear().add(callback)
    return this
  }
  clear() {
    this.callbacks.splice(0, this.callbacks.length)
    return this
  }
  once(callback: T) {
    this.onceCallbacks.push(callback)
    return this
  }
  add(callback: T) {
    this.callbacks.push(callback)
    return this
  }
  bind(callback: T) {
    this.add(callback)
    return () => {
      this.remove(callback)
      callback = null! // GC
    }
  }
  remove(callback: T) {
    const index = this.callbacks.findIndex(fn => fn === callback)
    if (index > -1) this.callbacks.splice(index, 1)
    return this
  }
  fire(...args: Parameters<T>) {
    this.callbacks.forEach(callback => {
      callback.apply(null, args)
    })
    let callback: T | undefined = undefined
    while (callback = this.onceCallbacks.pop()) {
      callback.apply(null, args)
    }
    return this
  }
  destory() {
    this.callbacks = []
    this.onceCallbacks = []
  }
}