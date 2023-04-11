import SCallback from "@/common/scallback"

export default class TabSelect<T extends object> {
  private callback: {
    change: SCallback<(value: T | null) => void>
  }
  data!: T[]
  actived: T | null = null
  index: number = -1
  isActived(item: T) {
    return this.actived === item
  }
  active(item: T | null) {
    const actived = this.actived
    this.actived = item
    if (item === null) {
      this.index = -1
    } else {
      this.index = this.data.indexOf(item)
    }
    if (actived !== item) {
      this.callback.change.fire(item)
    }
  }
  activeIndex(index: number) {
    if (this.data[index]) {
      this.active(this.data[index])
    } else {
      this.active(null)
    }
  }
  onChange(fn: (value: T | null) => void) {
    return this.callback.change.bind(fn)
  }
  constructor({ data, activedIndex, onChange }: {
    data: T[],
    activedIndex?: number
    onChange?: (value: T | null) => void
  }) {
    this.callback = {
      change: new SCallback
    }
    onChange && this.onChange(onChange)
    this.init({ data, activedIndex })
  }
  init({ data, activedIndex = -1 }: {
    data: T[],
    activedIndex?: number
  }) {
    this.data = data
    this.activeIndex(activedIndex)
  }

  destroy() {
    this.data = []
    this.callback.change.clear()
  }
}