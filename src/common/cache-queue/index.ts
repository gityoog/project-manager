export default class CacheQueue<T> {
  private cache: T[] = []
  private timer: NodeJS.Timeout | null = null
  private callbacks: Array<(data: T[]) => Promise<void>> = []
  private lock = false
  private time
  constructor({ time = 1000 }: {
    time?: number
  } = {}) {
    this.time = time
  }
  private async run() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.cache.length === 0 || this.lock) {
      return
    }
    this.timer = setTimeout(() => {
      this.timer = null
      this.flush()
    }, this.time)
  }
  private async flush() {
    this.lock = true
    const data = this.cache
    this.cache = []
    for (const callback of this.callbacks) {
      await callback(data)
    }
    this.lock = false
    this.run()
  }
  add(data: T) {
    this.cache.push(data)
    this.run()
  }
  pull(callback: (data: T[]) => Promise<void>) {
    this.callbacks.push(callback)
  }
}