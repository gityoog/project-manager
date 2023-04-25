import { IDisposable, IPty, spawn } from "node-pty"
import ProcessKill from "@/common/utils/process"

export default class NodePtyService {
  private process?: IPty
  private listeners: IDisposable[] = []

  run({ shell, args, cwd, env, handler }: {
    shell: string
    args: string[]
    cwd: string
    env?: Record<string, string>
    handler: {
      data: (data: string) => void
      exit: (code?: number | string | null, signal?: number | string | null) => void
    }
  }) {
    this.process = spawn(shell, args, {
      cwd,
      cols: 300,
      env
    })
    this.listeners.push(
      this.process.onData(data => {
        handler.data(data)
      }),
      this.process.onExit(({ exitCode, signal }) => {
        handler.exit(exitCode, signal)
      })
    )
    return this.process.pid
  }
  stop() {
    this.listeners.forEach(listener => listener.dispose())
    this.listeners = []
    if (this.process) {
      this.process.write('\x03')
      ProcessKill(this.process.pid, () => {
        this.process!.destroy()
        this.process = undefined!
      })
    }
  }
}