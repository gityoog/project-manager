import { Readable } from 'stream'

export default class DataQueue {
  static from(readable: Readable, callback: {
    data: (data: string) => void
    finish: (last: string) => void
    error: (err: any) => void
  }) {
    const queue = new DataQueue()
    queue.onData(callback.data)
    queue.onFinish(callback.finish)
    queue.onError(callback.error)
    readable.on('data', (chunk) => {
      queue.push(chunk)
    })
    readable.on('end', () => {
      queue.end()
    })
    readable.on('error', (err) => {
      queue.error(err)
    })
  }
  private cache?: string

  push(data: any) {
    if (data && data.toString) {
      const chunk = (data.toString() as string).split('\n')
      this.cache = (this.cache || '') + chunk[0]
      if (chunk.length > 1) {
        this.emitData(this.cache)
        chunk.slice(1, -1).forEach((c) => {
          this.emitData(c)
        })
        this.cache = chunk[chunk.length - 1]
      }
    }
  }

  private emitData(data: string) {
    this.callback.data?.(data.replace(/\\n/g, '\n'))
  }

  error(e: any) {
    this.callback.error?.(e)
    this.destroy()
  }

  end() {
    this.callback.finish?.(this.cache || '')
    this.destroy()
  }

  private callback: {
    data?: (data: string) => void
    finish?: (last: string) => void
    error?: (err: any) => void
  } = {}
  onData(callback: (data: string) => void) {
    this.callback.data = callback
  }

  onFinish(callback: (last: string) => void) {
    this.callback.finish = callback
  }

  onError(callback: (err: any) => void) {
    this.callback.error = callback
  }

  destroy() {
    this.callback = {}
  }
}