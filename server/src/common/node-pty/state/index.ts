import PtyUsageStats from "./stats"

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
  private stats = new PtyUsageStats

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
  writeStdout(data: string) {
    this.stdout.push(data)
    if (this.stdout.length > 10) {
      this.stdout.shift()
    }
    this.stdoutCallback?.(data)
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