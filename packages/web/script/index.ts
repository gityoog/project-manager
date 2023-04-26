import WebProject from "./web-project"
import path from 'path'
const type = process.argv[2]
const arg3 = parseInt(process.argv[3])
const port = isNaN(arg3) ? 3737 : arg3
const project = new WebProject({
  outPath: path.resolve(__dirname, '../../../dist/web'),
  context: path.resolve(__dirname, '../src'),
  app: './index.ts',
  polyfill: './polyfill/index.ts',
  analyzer: process.argv.some(arg => arg === '--analyzer'),
  proxyApi: 'http://localhost:' + port,
  socketApi: 'ws://localhost:' + port,
  env: {
    dev: {
      mainApi: './api/',
      socketApi: './socket/'
    },
    build: {
      mainApi: './',
      socketApi: './'
    }
  }
})

if (type === 'prod') {
  project.build()
} else {
  project.dev()
}