import WebProject from "./web-project"
import path from 'path'
const type = process.argv[2]

const project = new WebProject({
  outPath: path.resolve(__dirname, '../../server/dist/web'),
  context: path.resolve(__dirname, '../src'),
  app: './index.ts',
  polyfill: './polyfill/index.ts',
  analyzer: process.argv.some(arg => arg === '--analyzer'),
  proxyApi: 'http://localhost:4000',
  socketApi: 'ws://localhost:4000',
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