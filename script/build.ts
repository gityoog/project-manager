import { rimrafSync } from 'rimraf'
import path from 'path'
import { spawn } from 'child_process'
import fs from 'fs'
import ProjectManagerIpc from 'project-manager-ipc'
import webpack from 'webpack'
import TsconfigPathsWebpackContextPlugin from './tsconfig-paths-webpack-context-plugin'
import { zipFolder } from '@/common/zip'
import { EsbuildPlugin } from 'esbuild-loader'
import logUpdate from 'log-update'

(async () => {
  const cwd = path.resolve(__dirname, '../')
  const ipc = new ProjectManagerIpc()
  ipc.connect()
  const dist = path.resolve(cwd, './dist')
  if (!fs.existsSync(dist)) fs.mkdirSync(dist)
  console.log('Building web...')
  await buildWeb(cwd)
  const webzip = path.resolve(dist, 'web.zip')
  fs.writeFileSync(webzip, await zipFolder(path.resolve(cwd, './packages/web/dist'), { compression: 'DEFLATE', type: 'nodebuffer' }))
  console.log('Building server...')
  await buildServer(cwd)
  fs.unlinkSync(webzip)
  ipc.emitDist(path.resolve(cwd, './dist'), {
    name: '项目管理可视化',
    version: fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf-8').match(/"version":\s*?"(.*?)"/)?.[1] || '1.0.0',
  })
  ipc.destroy()
})()

async function buildWeb(cwd: string) {
  return new Promise<number | null>((resolve, reject) => {
    const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
      cwd: path.resolve(cwd, './packages/web'),
      stdio: 'inherit',
      env: {
        ...process.env,
        PROJECT_MANAGER_IPC_CHILD: undefined
      }
    })
    child.on('exit', (code) => {
      resolve(code)
    })
  })
}

async function buildServer(cwd: string) {
  return new Promise((resolve, reject) => {
    webpack({
      target: 'node',
      mode: 'production',
      output: {
        path: path.resolve(cwd, './dist'),
        publicPath: './',
        filename: '[name]',
        globalObject: 'global',
        clean: false
      },
      entry: {
        'index.js': path.resolve(cwd, './src/bin.ts')
      },
      resolve: {
        extensions: [".ts", ".js", ".tsx", ".json"]
      },
      externals: ({ request }, callback) => {
        if (request && /^node\:/.test(request)) {
          return callback(undefined, 'commonjs2 ' + request.slice(5))
        }
        callback()
      },
      module: {
        noParse: /node_modules[\\/]sql\.js[\\/]dist[\\/]sql-.*?\.js/,
        rules: [
          {
            test: /\.((c|m)?js)$/,
            include: path => /node_modules[\\/](axios)[\\/]/.test(path),
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
                      target: "es2015",
                      loose: true,
                    },
                    module: {
                      type: 'es6'
                    }
                  }
                }
              ]
          },
          {
            test: /\.zip$/,
            use: require.resolve('./buffer-loader')
          },
          {
            test: /\.wasm$/,
            use: require.resolve('./wasm-loader')
          },
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true
                }
              }
            ]
          }
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [
          new EsbuildPlugin({
            target: 'es6',
            keepNames: true,
          }),
        ]
      },
      ignoreWarnings: [
        /Module not found/,
        /Critical dependency: require function is used/,
        /Critical dependency: the request of a dependency/,
      ],
      plugins: [
        new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
        new webpack.ProgressPlugin(
          (percent, msg, module) => {
            logUpdate((percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || ''))
          }
        ),
        new TsconfigPathsWebpackContextPlugin,
        new webpack.IgnorePlugin({
          checkResource(request, context) {
            const lazyImports = [
              '@nestjs/microservices',
              '@nestjs/microservices/microservices-module',
              'cache-manager',
              'class-validator',
              'class-transformer',
              '@fastify/static'
            ]
            if (lazyImports.includes(request)) {
              return true
            }
            return false
          }
        })
      ]
    }).run((err, stats) => {
      if (err) throw err
      if (stats) {
        const data = stats.toJson()
        if (data.errors && data.errors.length > 0) {
          console.error(data.errors)
          return reject('Build failed')
        }
        if (data.warnings && data.warnings.length > 0) {
          console.warn('Build success with:\n', data.warnings)
        } else {
          console.log('Build success')
        }
      }
      resolve(stats)
    })
  })
}