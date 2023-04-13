import { Inject, Service } from "ioc-di"
import { Configuration, LoaderContext } from "webpack"
import iBaseConfigComponent from "../interface"
import Path from 'path'
import { EsbuildPlugin } from 'esbuild-loader'
import WebProjectOptions from "@/web-project/options"
import ProcessPlugin from "./process-plugin"
import Logger from "./process-plugin/logger"
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ProjectManagerWebpackPlugin from 'project-manager-webpack-plugin'

@Service()
export default class NormalConfig implements iBaseConfigComponent {
  @Inject() private options!: WebProjectOptions
  @Inject() private logger!: Logger

  getBaseConfig() {
    return {
      output: {
        path: this.options.outPath,
      },
      entry: this.options.entry,
      context: this.options.context,
      plugins: [
        new ProcessPlugin({
          process: true,
          logger: this.logger
        }),
        new ProjectManagerWebpackPlugin({
          devInfo: () => ({
            host: '0.0.0.0',
            port: this.options.realDevPort
          })
        })
      ],
      resolve: {
        extensions: ['.js', '.json', '.mjs'],
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
      },
      module: {
        rules: [
          {
            resourceQuery: /url$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/assets/[name].[contenthash:7][ext]'
            }
          },
          {
            resourceQuery: /raw$/,
            type: 'asset/source',
          },
          {
            test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
            issuer: /\.(s)?css/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024
              }
            },
            generator: {
              filename: 'static/fonts/[name].[contenthash:7][ext]'
            }
          },
          {
            test: /\.(png|jpe?g|gif)(\?.*)?$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024
              }
            },
            generator: {
              filename: 'static/images/[name].[contenthash:7][ext]'
            }
          },
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    auto: (path: string) => /\.module\.(sa|sc|c)ss$/.test(path),
                    getLocalIdent(loaderContext: LoaderContext<null>, _: string, localName: string) {
                      return `${localName}--${loaderContext._module!.debugId}`
                    },
                    localIdentName: '[local]--[hash]'
                  }
                }
              }
            ]
          },
          {
            test: /\.(sass|scss)$/,
            use: [
              {
                loader: 'resolve-url-loader'
              },
              {
                loader: "sass-loader",
                options: {
                  implementation: require("sass"),
                  sourceMap: true
                }
              }
            ]
          }
        ]
      }
    }
  }
  getDevConfig(): Configuration {
    return {
      mode: 'development',
      stats: 'none',
      infrastructureLogging: {
        level: 'warn'
      },
      output: {
        // publicPath: './',
        filename: 'static/js/[name].js'
      },
      experiments: {
        lazyCompilation: {
          imports: true,
          entries: false,
          backend: {
            client: require.resolve('./lazy-compilation/client.js')
          }
        }
      }
    }
  }
  getProdConfig(): Configuration {
    return {
      cache: {
        type: 'filesystem',
        maxAge: 1000 * 60 * 60 * 24,
        // cacheDirectory: Path.resolve(__dirname, '../../../../node_modules/.cache', this.options.title),
      },
      mode: 'production',
      target: ['web', 'es5'],
      entry: {
        polyfill: ['core-js/stable', 'regenerator-runtime/runtime']
      },
      performance: {
        maxAssetSize: 10 * 1024 * 1024,
        maxEntrypointSize: 10 * 1024 * 1024
      },
      output: {
        clean: true,
        publicPath: './',
        filename: 'static/js/[name].[contenthash].js'
      },
      module: {
        rules: [
          {
            test: /\.(m?js)$/,
            exclude: path => /node_modules/.test(path) && !/node_modules[\\/](socket\.io|engine\.io|axios|xterm|xterm\-addon\-fit|gojs|bpmn-js|qrcode|@bpmn-io|debug|color|wrequest|crypto-js|xlsx)/.test(path),
            enforce: 'post',
            use: (data: {
              resource: string
              realResource: string
              resourceQuery: string
              issuer: string
              compiler: string
            }) => [
                {
                  loader: 'swc-loader',
                  options: {
                    sync: true,
                    jsc: {
                      parser: {
                        syntax: "ecmascript",
                        dynamicImport: true
                      },
                      target: "es5",
                      loose: true,
                    },
                    module: {
                      type: 'es6'
                    }
                  }
                }
              ]
          }
        ]
      },
      optimization: {
        splitChunks: {
          chunks: chunk => chunk.name !== 'polyfill',
          minSize: 0,
          minChunks: 1,
          cacheGroups: {
            vendors: {
              test: /node_modules/,
              name: 'vendors'
            }
          }
        },
        minimize: !this.options.hasAnalyzer(),
        minimizer: [
          new EsbuildPlugin({
            target: 'es5',
            include: /static[\\/]js/
          }),
        ]
      },
      plugins: this.options.hasAnalyzer() ? [
        new BundleAnalyzerPlugin({
          analyzerPort: 7976
        })
      ] : []
    }
  }
}