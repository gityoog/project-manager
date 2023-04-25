import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import ProcessKill from "@/common/utils/process"

export default class ChildProcessService {
  private process?: ChildProcessWithoutNullStreams
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
  }) {
    this.process = spawn(shell, args, {
      cwd,
      env: {
        FORCE_COLOR: 'true',
        ...env,
      },
      stdio: 'pipe'
    })
    this.process.stdout.on('data', data => {
      handler.data(data.toString())
    })
    this.process.stderr.on('data', data => {
      handler.data(data.toString())
    })
    this.process.on('error', (err) => {
      handler.error(err)
    })
    this.process.on('exit', (exitCode, signal) => {
      handler.exit(exitCode, signal)
    })
    return this.process.pid!
  }
  stop() {
    if (this.process) {
      this.process.removeAllListeners()
      if (this.process.pid) {
        ProcessKill(this.process.pid, () => {
          if (this.process) {
            this.process.kill()
            this.process = undefined
          }
        })
      } else {
        this.process.kill()
        this.process = undefined
      }
    }
  }
}