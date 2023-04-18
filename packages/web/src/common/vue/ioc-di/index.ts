import { Root, Service, Container, Destroy, Concat, Inject, Already, InstanceMeta, PrototypeMeta } from "ioc-di"
import { Component } from 'vue-property-decorator'
import Vue, { VueConstructor, ComponentOptions } from 'vue'
import { VueClass } from 'vue-class-component/lib/declarations'

@Service()
export default class VueDIProvider {
  static readonly key = "_VueDIProvider"

  static create() {
    return new (Root()(VueDIProvider))()
  }

  static find(target: Vue) {
    let vm = target
    while (vm) {
      const provider: VueDIProvider = Reflect.get(vm, VueDIProvider.key)
      if (provider) {
        return provider
      }
      vm = vm.$parent as Vue
    }
    throw new Error("VueDIProvider not found")
  }

  bind(vm: Vue) {
    Reflect.set(vm, VueDIProvider.key, this)
  }
}

type ViewThis = Vue & {
  [ComponentContainer.key]: ComponentContainer
}

@Container()
@Service()
export class ComponentContainer {
  static readonly key = "_ComponentContainer"
  static bind(prototype: object): ComponentOptions<Vue> | undefined {
    const injections = PrototypeMeta.GetInjections(prototype)
    if (injections.length > 0) {
      return {
        beforeCreate(this: ViewThis) {
          InstanceMeta.Init(this, prototype)
          const container = this[ComponentContainer.key] = new ComponentContainer()
          Concat(container, this, Vue)
          // 将注入的属性从实例上隐藏 避免在第一次形成data时丢失响应
          injections.forEach(injection => {
            const key = injection.key
            Object.defineProperty(this, key, {
              enumerable: false,
              configurable: true,
              set: (value) => {
                container.setValue(key, value)
              },
              get: () => {
                return container.getValue(key)
              }
            })
          })
        },
        created(this: ViewThis) {
          Concat(VueDIProvider.find(this), this[ComponentContainer.key])
        },
        destroyed(this: ViewThis) {
          injections.forEach(injection => {
            Object.defineProperty(this, injection.key, {})
          })
          this[ComponentContainer.key].destroy()
          this[ComponentContainer.key] = undefined!
        }
      }
    }
  }

  private data: Record<string, unknown> = Vue.observable({})
  private cache: Record<string, unknown> = {}
  private inited = false
  constructor() {
    this.init()
  }
  @Already(true)
  private init() {
    this.inited = true
    Object.keys(this.cache).forEach(key => {
      Vue.set(this.data, key, this.cache[key])
    })
    this.cache = {}
  }
  setValue(key: string, value: unknown) {
    if (this.inited) {
      if (key in this.data) {
        this.data[key] = value
      } else {
        Vue.set(this.data, key, value)
      }
    } else {
      this.cache[key] = value
    }
  }
  getValue(key: string) {
    if (!this.inited) {
      return this.cache[key] || this.data[key]
    }
    return this.data[key]
  }
  @Destroy
  destroy() {
    this.cache = {}
    this.data = null!
  }
}

export {
  Inject,
  Destroy,
  Already,
  Concat
}

export function DIComponent<V extends Vue>(options: ComponentOptions<V> & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC
export function DIComponent<VC extends VueClass<Vue>>(target: VC): VC
export function DIComponent(arg: any) {
  if (typeof arg === 'function') {
    const options = ComponentContainer.bind(arg.prototype)
    if (options) {
      return Component({ mixins: [options] })(arg)
    } else {
      return Component(arg)
    }
  } else {
    return function (view: VueConstructor) {
      const options = ComponentContainer.bind(view.prototype)
      if (options) {
        arg.mixins = arg.mixins || []
        arg.mixins.push(options)
      }
      const component = Component(arg)(view)
      return component
    }
  }
}