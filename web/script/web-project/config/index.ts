import { Inject, Service } from 'ioc-di'
import { Configuration } from 'webpack'
import WebProjectOptions from '../options'
import merge from 'webpack-merge'
import NormalConfig from './components/normal'
import TypescriptConfig from './components/typescript'
import HtmlConfig from './components/html'

@Service()
export default class WebProjectConfig {
  @Inject() private options!: WebProjectOptions

  @Inject() private normal!: NormalConfig
  @Inject() private typescript!: TypescriptConfig
  @Inject() private html!: HtmlConfig

  getConfig(): Configuration {
    const isDev = this.options.isDevMode()
    return [
      this.normal,
      this.typescript,
      this.html
    ].reduce((config, item) => merge(
      config, item.getBaseConfig(), isDev ? item.getDevConfig() : item.getProdConfig()
    ), {})
  }
}