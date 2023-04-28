import { rimrafSync } from 'rimraf'
import path from 'path'
import { spawn } from 'child_process'
import Ncc from '@vercel/ncc'
import fs from 'fs'
import ProjectManagerIpc from 'project-manager-ipc'
import webpack from 'webpack'
import TsconfigPathsWebpackContextPlugin from './tsconfig-paths-webpack-context-plugin'

(async () => {
  const cwd = path.resolve(__dirname, '../')
  const ipc = new ProjectManagerIpc()
  ipc.connect()
  console.log('Clear ...')
  rimrafSync(path.resolve(cwd, './dist'))
  console.log('Building web...')
  await buildWeb(cwd)
  console.log('Building server...')
  await buildServer(cwd)
  ipc.emitDist(path.resolve(cwd, './dist'))
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
  return new Promise((resolve) => {
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
      module: {
        noParse: /node_modules[\\/]sql\.js[\\/]dist[\\/]sql-.*?\.js/,
        rules: [
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
        minimize: false
      },
      ignoreWarnings: [
        /Module not found/,
        /Critical dependency: require function is used/,
        /Critical dependency: the request of a dependency/,
      ],
      plugins: [
        new webpack.ProgressPlugin(
          (percent, msg, module) => {
            console.log((percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || ''))
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
      if (stats?.hasErrors()) {
        console.error(stats.toJson().errors)
      }
      if (stats?.hasWarnings()) {
        console.warn(stats.toJson().warnings)
      }
      resolve(stats)
    })
  })

  return Ncc(path.resolve(cwd, './src/bin.ts'), {
    transpileOnly: true
  }).then(({ err, code, assets, symlinks }) => {
    if (err) {
      throw err
    }
    const dist = path.resolve(cwd, './dist')
    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist)
    }
    fs.writeFileSync(path.resolve(dist, 'index.js'), code)
    for (const name in assets) {
      // exclude client-dist
      if (/^client-dist/.test(name)) {
        continue
      }
      const file = path.resolve(dist, name)
      const content = assets[name]
      const dir = path.dirname(file)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(file, content.source, { mode: content.permissions })
    }
    for (const name in symlinks) {
      const symlinkPath = path.resolve(dist, name)
      fs.symlinkSync(symlinks[name], symlinkPath)
    }
    if (process.platform === 'win32') {
      if (fs.existsSync(path.resolve(cwd, 'node_modules/node-pty/build/Release/winpty-agent.exe'))) {
        fs.copyFileSync(path.resolve(cwd, 'node_modules/node-pty/build/Release/winpty-agent.exe'), path.resolve(dist, 'build/Release/winpty-agent.exe'))
      }
    }
  })
}