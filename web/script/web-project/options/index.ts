import { Service } from "ioc-di"
import { EntryObject } from "webpack"
import { ProxyConfigMap } from "webpack-dev-server"

enum Mode {
  Dev = 'development',
  Prod = 'production',
}

type env = {
  mainApi: string
  socketApi: string
}

@Service()
export default class WebProjectOptions {
  devPort
  outPath
  version
  title
  context
  realDevPort
  private analyzer = false
  constructor(private options: {
    devPort?: number
    proxyApi?: string
    socketApi?: string
    title?: string
    context: string
    app: string | string[]
    polyfill?: string | string[]
    outPath: string
    analyzer?: boolean
    env: {
      dev: env
      build: env
    }
  }) {
    this.devPort = this.options.devPort || 9000
    this.realDevPort = this.devPort
    this.outPath = this.options.outPath
    this.title = this.options.title || 'default-project'
    this.context = this.options.context
    this.analyzer = this.options.analyzer || false
    const date = new Date()
    this.version = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`
  }
  private mode = Mode.Dev
  setDevMode() {
    this.mode = Mode.Dev
  }
  setProdMode() {
    this.mode = Mode.Prod
  }
  isDevMode() {
    return this.mode === Mode.Dev
  }
  isProdMode() {
    return this.mode === Mode.Prod
  }
  addAnalyzer() {
    this.analyzer = true
  }
  hasAnalyzer() {
    return this.analyzer
  }
  getEntry() {
    const entry: EntryObject = {
      app: this.options.app
    }
    if (!this.isDevMode() && this.options.polyfill) {
      entry.polyfill = this.options.polyfill
    }
    return entry
  }
  getEnv() {
    const env: Record<string, any> = {
      version: this.version,
      isDev: this.isDevMode(),
      ...this.isDevMode() ? this.options.env.dev : this.options.env.build
    }
    return env
  }
  getDevProxy() {
    const proxy: ProxyConfigMap = {}
    if (this.options.proxyApi) {
      proxy['/api'] = {
        target: this.options.proxyApi,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
      proxy['/socket'] = {
        target: this.options.proxyApi,
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/socket': '' }
      }
    }
    return proxy
  }
}