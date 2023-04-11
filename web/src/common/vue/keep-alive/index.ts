import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { VNode } from 'vue/types/umd'
import IMyKeepAlive from './service'

export interface iMyKeepAlive {
  isCache(key: string): boolean
  getCache(key: string): {
    ins: Vue
    tag: string
  } | undefined
  setCache(key: string, data: {
    ins: Vue
    tag: string
  }): void
  genKey(vnode: VNode): string
  updated(): void
}

@Component({
  // @ts-ignore
  abstract: true
})
export default class MyKeepAlive extends Vue {
  $props!: {
    service?: iMyKeepAlive
  }

  @Prop({
    default: () => new IMyKeepAlive({ all: true })
  }) service!: iMyKeepAlive

  private cache?: {
    vnode: VNode
    key: string
    tag: string
  }

  private updateCache() {
    if (this.cache) {
      this.service.setCache(this.cache.key, {
        ins: this.cache.vnode.componentInstance!,
        tag: this.cache.tag
      })
      this.cache = undefined
    }
    this.service.updated()
  }
  mounted() {
    this.updateCache()
  }
  updated() {
    this.updateCache()
  }

  render() {
    let vnode = getFirstComponentChild(this.$slots.default)
    if (vnode?.componentOptions) {
      const key = this.service.genKey(vnode)
      if (this.service.isCache(key)) {
        const cache = this.service.getCache(key)
        const tag = getComponentKey(vnode)
        if (cache) {
          if (cache.tag !== tag) {
            this.cache = {
              vnode, key, tag
            }
          } else {
            vnode.componentInstance = cache.ins
          }
        } else {
          this.cache = {
            vnode, key, tag
          }
        }
        vnode.data && (vnode.data.keepAlive = true)
      }
    }
    return vnode || this.$slots.default?.[0]
  }
}

function getComponentKey(vnode: VNode) {
  const ctor = vnode.componentOptions?.Ctor
  return vnode.tag + (ctor ? (ctor as unknown as { cid: string }).cid : '') + '::'
}

function getFirstComponentChild(nodes: VNode[] | undefined) {
  return nodes?.find(node => {
    return node && (node.componentOptions || isAsyncPlaceholder(node))
  })
}

function isAsyncPlaceholder(node: VNode): boolean {
  return node.isComment && (node as unknown as { asyncFactory: any }).asyncFactory
}