import { Configuration } from "webpack"
import iBaseConfigComponent from "../interface"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Inject, Service } from "ioc-di"
import WebProjectOptions from "@/web-project/options"
import path from 'path'
import CopyPlugin from "copy-webpack-plugin"

@Service()
export default class HtmlConfig implements iBaseConfigComponent {
  @Inject() private options!: WebProjectOptions

  private getHTMLOptions(): HtmlWebpackPlugin.Options {
    return {
      inject: true,
      script: `<script> var ENV = ${JSON.stringify(this.options.getEnv())} </script>`,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: false
      },
      scriptLoading: 'blocking',
      chunksSortMode: 'manual',
      template: path.resolve(__dirname, './template/index.html'),
      filename: 'index.html'
    }
  }
  getBaseConfig(): Configuration {
    return {
      plugins: [
        new CopyPlugin({
          patterns: [{
            from: path.resolve(__dirname, './template/static'),
            to: 'static'
          }]
        })
      ]
    }
  }
  getDevConfig() {
    return {
      plugins: [
        new HtmlWebpackPlugin({
          ...this.getHTMLOptions(),
          chunks: ['app']
        })
      ]
    }
  }
  getProdConfig() {
    return {
      plugins: [
        new HtmlWebpackPlugin({
          ...this.getHTMLOptions(),
          chunks: ['polyfill', 'app']
        })
      ]
    }
  }
}