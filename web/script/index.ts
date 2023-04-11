import WebProject from "./web-project"
import path from 'path'
const type = process.argv[2]

const project = new WebProject({
  outPath: path.resolve(__dirname, '../dist'),
  context: path.resolve(__dirname, '../src'),
  entry: {
    app: './index.ts'
  },
  analyzer: process.argv.some(arg => arg === '--analyzer'),
  proxyApi: 'http://localhost:4000',
  socketApi: 'ws://localhost:4000',
})

if (type === 'prod') {
  project.build()
} else {
  project.dev()
}