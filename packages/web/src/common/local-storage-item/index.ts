function queryItem<T = any>(key: string): T | undefined {
  try {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  } catch (e) {
    return
  }
}

function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default class LocalStorageItem<T> {
  private value: T
  private key: string
  private def: T | (() => T)
  private onStorageChange = (e: StorageEvent) => {
    if (e.key === this.key && e.oldValue !== e.newValue) {
      this.set(
        this.getLocal()
      )
    }
  }
  constructor({ default: value, key }: {
    default: T | T | (() => T)
    key: string
  }) {
    this.def = value
    this.key = key
    this.value = this.getLocal()
    window.addEventListener("storage", e => {
      if (e.key === this.key && e.oldValue !== e.newValue) {
        this.set(
          this.getLocal()
        )
      }
    })
  }
  private getLocal() {
    const localValue = queryItem(this.key)
    return localValue === undefined ? (isFn(this.def) ? this.def() : this.def) : localValue
  }
  private changeCallback?: (value: T) => void
  onChange(callback: (value: T) => void, immediate?: boolean) {
    this.changeCallback = callback
    if (immediate) {
      this.fireChange()
    }
  }
  private fireChange() {
    this.changeCallback?.(this.value)
  }
  get() {
    return this.value
  }
  set(value: T) {
    if (this.value !== value) {
      this.value = value
      setItem(this.key, value)
      this.fireChange()
    }
  }
  destroy() {
    this.changeCallback = undefined
    window.removeEventListener("storage", this.onStorageChange)
  }
}

function isFn(value: unknown): value is Function {
  return typeof value === 'function'
}