import { iMyKeepAlive } from "."
import Vue from 'vue'
import { VNode } from 'vue/types/umd'

export default class IMyKeepAlive implements iMyKeepAlive {
  constructor(private options: {
    all?: boolean
  } = {}) { }
  private cacheKey: Record<string, boolean> = {}
  private cache?: Record<string, {
    ins: Vue
    tag: string
  }>

  isCache(key: string) {
    return this.options.all || !!this.cacheKey[key]
  }

  genKey(vnode: VNode) {
    if (typeof vnode.key === 'string') {
      return vnode.key
    } else {
      console.error(vnode, 'key is not exist')
      return ''
    }
  }

  getCache(key: string) {
    return this.cache?.[key]
  }

  setCache(key: string, data: {
    ins: Vue
    tag: string
  }) {
    this.cache = this.cache || {}
    this.cache[key] = data
  }

  add(key: string) {
    Vue.set(this.cacheKey, key, true)
  }

  remove(key: string) {
    if (this.cache?.[key]) {
      this.cache[key].ins.$destroy()
      delete this.cache[key]
    }
    Vue.set(this.cacheKey, key, false)
  }

  updated() {

  }

  destroy() {
    this.cacheKey = {}
    for (const key in this.cache) {
      this.cache[key].ins.$destroy()
    }
    this.cache = undefined
  }
}