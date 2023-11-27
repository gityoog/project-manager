import { Inject } from "@nestjs/common"
import LoggingContext from ".."
import { getErrorMessage } from "@/common/utils"

const symbol = Symbol('Logging')

type RealReturn<T> = T extends (...args: any) => Promise<infer R> ? R : T extends (...args: any) => infer R ? R : never
type ControllerOptions = { name?: string }
type RouteOptions<T extends (...args: any) => any> = {
  action?: string
  description?: (args: Parameters<T>, result: RealReturn<T>) => string
  error?: (args: Parameters<T>, error: unknown) => string
}

function Logging<T extends Object, K extends string>(args?: K extends keyof T ? T[K] extends (...args: any) => any ? RouteOptions<T[K]> : never : ControllerOptions) {
  return function (target: T | Function, propertyKey: K, descriptor: PropertyDescriptor) {
    if (propertyKey && descriptor) {
      if (!Reflect.getMetadata(symbol, target)) {
        Reflect.defineMetadata(symbol, true, target)
        Inject(LoggingContext)(target, symbol)
      }
      const options = args as RouteOptions<(...args: any) => any> | undefined
      const original = descriptor.value
      const action = options?.action || propertyKey
      descriptor.value = cloneMetadata(async function (this: any, ...args: any[]) {
        const name = (Reflect.getMetadata(symbol, target.constructor) as string | undefined || target.constructor.name).replace(/Controller$/, '')
        const service = this[symbol] as LoggingContext
        try {
          const result = await original.apply(this, args)
          service.success(name, action, options?.description?.(args, result))
          return result
        } catch (e) {
          service.fail(name, action, options?.error?.(args, e) ?? getErrorMessage(e))
          throw e
        }
      }, original)
    } else {
      const options = args as ControllerOptions | undefined
      const Constructor = target as Function
      Reflect.defineMetadata(symbol, options?.name || Constructor.name, Constructor)
    }
  } as ((target: T, propertyKey: K, descriptor: PropertyDescriptor) => void) & ClassDecorator
}

function cloneMetadata<T extends Function>(target: T, fn: T) {
  Reflect.getMetadataKeys(fn).forEach(key => {
    Reflect.defineMetadata(key, Reflect.getMetadata(key, fn), target)
  })
  Object.defineProperty(target, 'name', { value: fn.name })
  return target
}

export default Logging