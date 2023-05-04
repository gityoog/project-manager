import { LoaderContext } from 'webpack'
import fs from 'fs'
import path from 'path'

export default function (this: LoaderContext<{}>, _: string) {
  const filepath = path.resolve(this.context, this.resource)
  const base64 = fs.readFileSync(filepath).toString('base64')
  return `module.exports = Buffer.from("${base64}", "base64")`
}