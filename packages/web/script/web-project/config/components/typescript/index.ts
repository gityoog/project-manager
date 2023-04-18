import iBaseConfigComponent from "../interface"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import VueTsxTransformer from "vue-tsx-transformer"
import { Inject, Service } from "ioc-di"
import WebProjectOptions from "@/web-project/options"
import TsconfigPathsWebpackContextPlugin from "./tsconfig-paths-webpack-context-plugin"
import { Configuration } from "webpack"

@Service()
export default class TypescriptConfig implements iBaseConfigComponent {
  @Inject() private options!: WebProjectOptions

  getBaseConfig() {
    return {
      resolve: {
        extensions: ['.tsx', '.ts']
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                  getCustomTransformers: () => ({
                    before: [VueTsxTransformer()]
                  }),
                  compilerOptions: this.options.isProdMode() ? {
                    target: 'ES5'
                  } : undefined
                }
              }
            ]
          },
          {
            test: /\.svg$/,
            exclude: /node_modules/,
            issuer: /\.tsx?$/,
            use: [
              require.resolve('./vue-svg-loader'),
              'svg-sprite-loader',
              {
                loader: 'svgo-loader',
                options: {
                  plugins: [{
                    name: "removeAttrs",
                    params: {
                      attrs: "(fill|stroke)"
                    }
                  }]
                }
              }
            ]
          }
        ]
      },
      ignoreWarnings: [/export .* was not found in/],
      plugins: [
        new TsconfigPathsWebpackContextPlugin()
      ]
    }
  }
  getDevConfig() {
    return {
      module: {
        rules: [
          {
            test: /\.tsx$/,
            loader: require.resolve('./jsx-loader/hot-reload.js')
          }
        ]
      },
      plugins: [
        new ForkTsCheckerWebpackPlugin
      ]
    }
  }
  getProdConfig(): Configuration {
    return {
      module: {
        rules: [
          {
            test: /node_modules[\\/]ioc-di[\\/].*?\.m?js$/,
            enforce: 'post',
            use: {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions: {
                  allowJS: true,
                  target: 'ES5'
                }
              }
            }
          }
        ]
      }
    }
  }
}