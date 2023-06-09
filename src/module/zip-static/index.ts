import { Module } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import Options from "@/options"
import { Express } from 'express'
import JSZip from 'jszip'
import mime from 'mime'

@Module({})
export default class ZipStaticModule {
  private cache: {
    [url: string]: Promise<{
      type: string
      content: Buffer | string
    }> | null
  } = {}
  private zipper = new JSZip
  constructor(
    private adapterHost: HttpAdapterHost,
    private options: Options
  ) {
    if (this.options.web instanceof Buffer) {
      const app = this.adapterHost.httpAdapter.getInstance<Express>()
      this.zipper.loadAsync(this.options.web).then(() => {
        app.use((req, res, next) => {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            next()
          } else {
            const path = req._parsedUrl.pathname
            const result = this.query(path)
            if (result) {
              result.then(({ type, content }) => {
                res.setHeader('Content-Type', type)
                res.status(200).send(content)
              })
            } else {
              next()
            }
          }
        })
      })
    }
  }

  private query(url: string): Promise<{ type: string, content: Buffer | string }> | null {
    if (this.cache[url] === undefined) {
      const paths = [url, url.endsWith('/') ? url + 'index.html' : url + '/index.html'].map(p => p.replace(/^\//, ''))
      const file = this.zipper.file(paths[0]) || this.zipper.file(paths[1])
      if (file) {
        const type = mime.lookup(file.name)
        const encoding = mime.charsets.lookup(type, '')
        const result = file.async('nodebuffer').then(content => {
          return {
            type,
            content: encoding ? content.toString(encoding as BufferEncoding) : content
          }
        })
        this.cache[url] = result
      } else {
        this.cache[url] = null
      }
    }
    return this.cache[url]
  }
}