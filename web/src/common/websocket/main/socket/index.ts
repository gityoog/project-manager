import io, { Socket, ManagerOptions, SocketOptions } from 'socket.io-client'

namespace MySocket {
  export type Options<NS extends string | void = string, Query = void> =
    (Query extends void ? { query?: void } : { query: Query })
    & (NS extends void ? { namesapce?: NS } : { namesapce: NS })
    & {
      options?: Omit<Partial<ManagerOptions & SocketOptions>, 'path' | 'autoConnect' | 'query'>
    }
  export type handler = (args: any[], fn: (...args: any[]) => any, onError?: (error: string) => void) => void
}

class MySocket<TOn extends { [key: string]: any[] } = {}, TEmit extends { [key: string]: any[] } = {}> {
  socket: Socket
  status = 0
  constructor(private options: {
    url: string
    namesapce: string
    data?: MySocket.Options<any, any>
    token?: string
    handler?: MySocket.handler
  }) {
    const { url, namesapce, data, token } = this.options
    const { query, namesapce: suffixNamespace = '', options: exOptions } = data || {}
    const { protocol, host, pathname } = getRealPathDetail(url)

    this.socket = io(protocol + '//' + host + namesapce + suffixNamespace, {
      ...exOptions,
      path: pathname + 'socket.io',
      autoConnect: false,
      query: Object.assign({}, query, token ? { token } : {}),
    })
    this.socket.on('connect', () => {
      this.status = 1
    })
    this.socket.on('disconnect', () => {
      this.status = -1
    })
  }
  private inited = false
  private init() {
    if (!this.inited) {
      this.inited = true
      this.socket.connect()
    }
  }
  clear() {
    this.socket.removeAllListeners()
    this.socket.disconnect()
    this.inited = false
  }
  on<K extends Exclude<keyof TOn, number | symbol>>(event: K, fn: (...args: TOn[K]) => void, onError?: (error: string) => void) {
    this.init()
    const callback = (...args: any) => {
      const handler = this.options.handler
      if (handler) {
        return handler(args, fn, onError)
      } else {
        return fn(...args)
      }
    }
    this.socket.on(event, callback as any)
    return () => this.off(event, callback)
  }
  off<K extends Exclude<keyof TOn, number | symbol>>(event: K, fn: (...args: TOn[K]) => void) {
    this.socket.off(event, fn as any)
    return fn
  }
  onAny<K extends Exclude<keyof TOn, number | symbol>>(fn: (event: K, ...args: TOn[K]) => void) {
    this.init()
    this.socket.onAny(fn as any)
    return () => this.socket.offAny(fn as any)
  }
  emit<K extends Exclude<keyof TEmit, number | symbol>>(event: K, ...args: TEmit[K]) {
    this.init()
    this.socket.emit(event, ...args)
  }
  send(...args: any[]) {
    this.init()
    this.socket.send(...args)
  }
  destroy() {
    this.clear()
    // @ts-ignore
    if (this.socket.nsp in this.socket.io.nsps) {
      // @ts-ignore
      delete this.socket.io.nsps[this.socket.nsp]
    }
    // @ts-ignore
    this.socket.destroy()
  }
}



function getRealPathDetail(address: string) {
  let url = new URL(address, location.href)
  const result = {
    url: url.href,
    host: url.host,
    search: url.search,
    pathname: url.pathname,
    protocol: url.protocol
  }
  url = null!
  return result
}

export default MySocket