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

function setItem(key: string, value: any, noneStringify?: boolean) {
  localStorage.setItem(key, noneStringify ? value : JSON.stringify(value))
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
  private changeCallback: Array<(value: T) => void> = []
  onChange(callback: (value: T) => void, immediate?: boolean) {
    this.changeCallback.push(callback)
    if (immediate) {
      callback(this.value)
    }
    return () => {
      const index = this.changeCallback.indexOf(callback)
      if (index !== -1) {
        this.changeCallback.splice(index, 1)
      }
    }
  }
  private fireChange() {
    this.changeCallback.forEach(callback => callback(this.value))
  }
  get() {
    return this.value
  }
  set(value: T) {
    if (this.value === value) return
    var oldValue = JSON.stringify(this.value)
    var newValue = JSON.stringify(value)
    if (oldValue !== newValue) {
      this.value = JSON.parse(newValue)
      setItem(this.key, newValue, true)
      this.fireChange()
    }
  }
  private binds: Array<{ obj: any, key: string }> = []
  bind<K extends string>(obj: { [key in K]: T }, key: K): T {
    this.binds.push({ obj, key })
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: () => this.get(),
      set: (value) => {
        this.set(value)
      },
    })
    return this.get()
  }

  clear() {
    localStorage.removeItem(this.key)
  }
  destroy() {
    this.binds.forEach(({ obj, key }) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: () => undefined,
        set: () => { },
      })
    })
    this.binds = undefined!
    this.changeCallback = undefined!
    window.removeEventListener("storage", this.onStorageChange)
  }
}

function isFn(value: unknown): value is Function {
  return typeof value === 'function'
}

type Value<T extends LocalStorageItem<unknown>> = T extends LocalStorageItem<infer V> ? V : never

export class LocalStorageItems<T extends {
  [key: string]: LocalStorageItem<any>
}> {
  constructor(private data: T) {

  }
  watch = <K extends keyof T>(key: K, callback: (value: Value<T[K]>) => void, immediate?: boolean) => {
    return this.data[key].onChange(callback, immediate)
  }

  bind<Key extends keyof T>(obj: { [key in Key]: Value<T[Key]> }, key: Key): Value<T[Key]>
  bind<Key extends string, TK extends keyof T>(obj: { [key in Key]: Value<T[TK]> }, key: Key, prop: TK): Value<T[TK]>
  bind<Key extends string, TK extends keyof T>(obj: { [key in Key]: Value<T[TK]> }, key: Key, prop?: TK): Value<T[TK]> {
    return this.data[prop || key].bind(obj, key)
  }

  destroy() {
    Object.values(this.data).forEach(item => item.destroy())
    this.data = {} as T
  }
}