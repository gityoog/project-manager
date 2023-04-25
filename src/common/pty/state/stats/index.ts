import os from 'os'
import pidusage from 'pidusage'
import ProcessTree from 'process-tree'

type stats = {
  cpu: string
  memory: string
}

export default class PtyUsageStats {
  private cores = os.cpus().length
  private callback?: (stats: stats | null) => void
  private timeout?: NodeJS.Timeout
  private index = 0
  private running = false
  private data: stats | null = null
  constructor(private options: { onError?: (name: string, err: Error) => void } = {}) { }
  getData() {
    return this.data
  }
  private setData(data: stats | null) {
    this.data = data
    this.callback?.(this.data)
  }
  onUpdate(callback: (stats: stats | null) => void) {
    this.callback = callback
  }
  start(pid: number) {
    this.running = true
    const index = ++this.index
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }
    this.query(pid, (err, stats) => {
      if (err) return this.options.onError ? this.options.onError(err.name, err.err) : console.log(err.name, err.err.message)
      if (index !== this.index) return
      if (!this.running) return
      this.setData(stats || null)
      this.timeout = setTimeout(() => this.start(pid), 1000)
    })
  }
  private query(pid: number, callback: (err: null | ({ name: string, err: Error }), stats?: stats) => void) {
    ProcessTree(pid, (err, children) => {
      if (err) return callback({ err, name: `QueryProcessTree: ${pid}` })
      const pids: number[] = [pid]
      while (children.length) {
        const child = children.shift()
        if (child) {
          children = children.concat(child.children)
          pids.push(child.pid)
        }
      }
      pidusage(pids, (err, stats) => {
        if (err) return callback({ err, name: `QueryProcessUsage: ${pids.join(',')}` })
        const data = Object.values(stats).reduce((total, cur) => ({
          cpu: total.cpu + cur.cpu,
          memory: total.memory + cur.memory,
        }), { cpu: 0, memory: 0 })
        callback(null, {
          cpu: (data.cpu / this.cores).toFixed(2) + '%',
          memory: (data.memory / 1024 / 1024).toFixed(2) + 'MB'
        })
      })
    })
  }
  stop() {
    pidusage.clear()
    this.running = false
    this.setData(null)
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }
  }
  destroy() {
    this.stop()
    this.callback = undefined
  }
}