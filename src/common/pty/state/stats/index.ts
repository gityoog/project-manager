import ProcUsage from '@/common/proc-usage'
import os from 'os'

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
  private proc = ProcUsage.factory()
  constructor(private options: { onError?: (name: string, err: Error) => void } = {}) { }
  getData() {
    return this.data
  }
  private setData(data: stats | null) {
    if (this.data !== data) {
      this.data = data
      this.callback?.(this.data)
    }
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
    this.proc.get(pid, (usage) => {
      if (!usage) {
        return callback(null)
      }
      const data: ProcUsage.Proc[] = []
      function add(proc: ProcUsage.Proc) {
        data.push(proc)
        proc.children.forEach(item => add(item))
      }
      add(usage)
      const stats = data.reduce((total, cur) => ({
        cpu: total.cpu + (cur.cpu || 0),
        memory: total.memory + (cur.mem || 0),
      }), { cpu: 0, memory: 0 })

      callback(null, {
        cpu: (stats.cpu / this.cores).toFixed(2) + '%',
        memory: (stats.memory / 1024 / 1024).toFixed(2) + 'MB'
      })
    })
  }
  stop() {
    this.running = false
    this.setData(null)
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }
  }
  destroy() {
    this.proc.destroy()
    this.stop()
    this.callback = undefined
  }
}