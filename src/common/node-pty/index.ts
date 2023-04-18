import { IDisposable, IPty, spawn } from "node-pty"
import PtyState from "./state"

export default class NodePtyService {
  private process?: IPty
  private listeners: IDisposable[] = []
  private state = new PtyState

  constructor(private options: {
    stats?: boolean
    env?: Record<string, string>
  } = {}) {

  }

  run({ command, cwd, shell, env }: {
    shell: string
    command: string | string[]
    cwd: string
    env?: Record<string, string>
  }) {
    if (!this.process) {
      const args = shell.split(' ')
      this.process = spawn(args[0], args.slice(0).concat(command), {
        cwd,
        cols: 300,
        env: {
          ...process.env as Record<string, string>,
          ...this.options.env,
          ...env
        },
      })
      this.state.setStatus(true)
      if (this.options.stats !== false) {
        this.state.activeStats(this.process.pid)
      }
      this.tip('start')
      this.listeners.push(
        this.process.onData(data => {
          this.state.writeStdout(data)
        }),
        this.process.onExit(({ exitCode, signal }) => {
          this.tip('exit', `exitCode: ${exitCode}, signal: ${signal || 'null'}`)
          this.clear()
        })
      )
    }
    return this.process.pid
  }

  stop() {
    if (this.process) {
      this.tip('kill')
      this.clear()
    }
    return true
  }

  info() {
    return this.state.get()
  }

  tip(name: string, detail?: string) {
    this.state.writeStdout('\n' +
      `------${name}------` +
      (detail ? `\n${detail}\n------${name}------` : '')
    )
  }

  onStdoutPush(callback: (data: string) => void) {
    this.state.onStdoutPush(callback)
  }

  onStatusChange(callback: (status: boolean) => void) {
    this.state.onStatusChange(callback)
  }

  onStatsUpdate(callback: (stats: PtyState.stats | null) => void) {
    this.state.onStatsUpdate(callback)
  }

  private clear() {
    this.state.setStatus(false)
    this.state.clear()
    this.listeners.forEach(listener => listener.dispose())
    this.listeners = []
    if (this.process) {
      this.process.write('\x03')
      this.process.destroy()
      this.process = undefined
    }
  }

  destroy() {
    this.clear()
    this.state.destroy()
  }
}