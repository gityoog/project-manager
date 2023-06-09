import PtyUsageStats from "./stats"
import boxen from 'boxen'

namespace PtyState {
  export type url = {
    host: string
    port: string
  }
  export type stats = {
    cpu: string
    memory: string
  }
}

class PtyState {
  private stdout: string[] = []
  private status = false
  private stats = new PtyUsageStats({ onError: this.options.onError })
  constructor(private options: { onError?: (name: string, err: Error) => void } = {}) { }
  activeStats(pid: number) {
    if (pid) {
      this.stats.start(pid)
    } else {
      this.stats.stop()
    }
  }

  get() {
    return {
      status: this.status,
      stdout: this.stdout,
      stats: this.stats.getData()
    }
  }

  onStatsUpdate(callback: (stats: PtyState.stats | null) => void) {
    this.stats.onUpdate(callback)
  }

  private stdoutCallback?: (data: string) => void
  writeStdout(data: string, { LF }: { LF?: boolean } = { LF: false }) {
    if (this.stdout.length > 10) {
      this.stdout.shift()
    }
    const last = this.stdout[this.stdout.length - 1]
    if (LF && last) {
      const ending = last[last.length - 1]
      if (ending && ending !== '\n' && ending !== '\r') {
        data = '\n' + data
      }
    }
    this.stdout.push(data)
    this.stdoutCallback?.(data)
  }
  writeMessage(name: string, detail?: string, newLine?: boolean) {
    this.writeStdout(boxen(detail || name, { title: detail ? name : undefined, padding: { left: 1, right: 1 } }), { LF: true })
    if (newLine) {
      this.writeStdout('\n')
    }
  }

  onStdoutPush(callback: (data: string) => void) {
    this.stdoutCallback = callback
  }

  private statusChange?: (status: boolean) => void
  setStatus(status: boolean) {
    if (this.status !== status) {
      this.status = status
      this.statusChange?.(this.status)
    }
  }
  onStatusChange(callback: (status: boolean) => void) {
    this.statusChange = callback
  }

  clear() {
    this.stats.stop()
    this.setStatus(false)
  }

  destroy() {
    this.stdout = []
    this.stats.destroy()
    this.stdoutCallback = undefined
    this.statusChange = undefined
  }
}

export default PtyState