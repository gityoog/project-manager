import { Inject, Service } from "ioc-di"
import portfinder from "portfinder"
import { webpack } from "webpack"
import WebpackDevServer from "webpack-dev-server"
import WebProjectConfig from "../config"
import WebProjectOptions from "../options"

@Service()
export default class WebProjectDeveloper {
  @Inject() private options!: WebProjectOptions
  @Inject() private config!: WebProjectConfig

  async run() {
    this.options.setDevMode()
    const port = await portfinder.getPortPromise({
      port: this.options.devPort
    })
    this.options.realDevPort = port
    const compiler = webpack(this.config.getConfig())
    new WebpackDevServer({
      host: '0.0.0.0',
      port,
      hot: true,
      liveReload: false,
      allowedHosts: "all",
      compress: true,
      client: {
        logging: "warn",
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      proxy: {
        ...this.options.getDevProxy(),
        '/lazyCompilation': {
          target: 'http://localhost',
          pathRewrite: () => "",
          router: function (req) {
            return decodeURIComponent(
              // @ts-ignore
              req._parsedUrl.query
            )
          }
        }
      }
    }, compiler).startCallback(err => {
      if (!err) {

      }
    })
  }
}