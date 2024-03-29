import ChildProcessService from './child_process'
import PtyState from "./state"

interface iPtyProcess {
  run({ shell, args, cwd, env, handler }: {
    shell: string
    args: string[]
    cwd: string
    env?: Record<string, string>
    handler: {
      data: (data: string) => void
      exit: (code?: number | string | null, signal?: number | string | null) => void
      error: (err: Error) => void
    }
  }): number
  stop(): void
  write(data: string): void
}

namespace PtyService {
  export type Type = 'node-pty' | 'child_process'
}

class PtyService {
  static Types: {
    name: string
    value: PtyService.Type
    disabled?: boolean
  }[] = [{
    name: 'child_process',
    value: 'child_process'
  }, {
    name: 'node-pty',
    value: 'node-pty',
    disabled: true
  }]
  private state = new PtyState({ onError: this.options.onError })
  private process?: iPtyProcess
  constructor(protected options: {
    stats?: boolean
    env?: Record<string, string>
    onError?: (name: string, err: Error) => void
  }) { }

  run({ shell, command, cwd, env, type, encoding }: {
    shell: string
    command: string | string[]
    cwd: string
    env?: Record<string, string>
    type?: PtyService.Type
    encoding?: string
  }) {
    if (this.process) {
      return false
    }
    switch (type) {
      case 'node-pty':
      case 'child_process':
      default:
        this.process = new ChildProcessService({ encoding })
    }
    try {
      const args = shell.split(' ')
      const pid = this.process.run({
        shell: args[0],
        args: args.slice(1).concat(command),
        cwd,
        env: {
          ...process.env as Record<string, string>,
          ...this.options.env,
          ...env
        },
        handler: {
          data: (data) => {
            this.state.writeStdout(data)
          },
          exit: (code, signal) => {
            this.state.writeMessage('exit', `code: ${code || 'null'}, signal: ${signal || 'null'}`)
            this.clear()
          },
          error: error => {
            this.options.onError ? this.options.onError(`ProcessError: ${pid}`, error) : console.error(error)
            this.clear()
          }
        }
      })
      this.state.writeMessage('start', undefined, true)
      this.state.setStatus(true)
      if (this.options.stats !== false) {
        this.state.activeStats(pid)
      }
      return pid
    } catch (e) {
      this.options.onError ? this.options.onError(`ProcessError`, e instanceof Error ? e : new Error('unknown')) : console.error(e)
      this.clear()
      return false
    }
  }

  info() {
    return this.state.get()
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

  stop() {
    this.state.writeMessage('kill')
    this.clear()
    return true
  }

  clear() {
    this.state.clear()
    if (this.process) {
      this.process.stop()
      this.process = undefined
    }
  }

  tip(name: string, detail?: string) {
    this.state.writeMessage(name, detail)
  }

  write(data: string) {
    this.process?.write(data)
  }

  destroy() {
    this.state.destroy()
    if (this.process) {
      this.process.stop()
      this.process = undefined
    }
  }
}

export default PtyService