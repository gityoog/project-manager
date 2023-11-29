export default abstract class BasicStrategyManager<T> {
  protected actived?: T = undefined
  private cache: Record<string, T> = {}

  protected abstract factory(type: string): T | undefined
  type: string = ''
  active(type?: string) {
    this.type = type || ''
    if (!this.cache[this.type]) {
      const service = this.factory(this.type)
      if (service) {
        this.cache[this.type] = service
      }
    }
    if (this.actived !== this.cache[this.type]) {
      const old = this.actived
      this.actived = this.cache[this.type]
      this.onActivedCallback?.(this.actived, old)
    }
  }
  private onActivedCallback?: (actived?: T, old?: T) => void
  protected onActived(callback: (actived?: T, old?: T) => void) {
    this.onActivedCallback = callback
  }
  setCache(type: string, service: T) {
    this.cache[type] = service
  }
  each(callback: (item: T) => void) {
    Object.values(this.cache).forEach(item => callback(item))
  }

  destroy() {
    this.onActivedCallback = null!
    this.actived = null!
    this.cache = null!
  }
}