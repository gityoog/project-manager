import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import ProcessKill from "@/common/utils/process"
import iconv from 'iconv-lite'

export default class ChildProcessService {
  private process?: ChildProcessWithoutNullStreams
  constructor(private options: { encoding?: string } = {}) {
    if (options.encoding) {
      if (options.encoding === 'utf8' || !iconv.encodingExists(options.encoding)) {
        options.encoding = undefined
      }
    }
  }
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
      handler.data(this.decode(data, e => handler.error(e)))
    })
    this.process.stderr.on('data', data => {
      handler.data(this.decode(data, e => handler.error(e)))
    })
    this.process.on('error', (err) => {
      handler.error(err)
    })
    this.process.on('exit', (exitCode, signal) => {
      handler.exit(exitCode, signal)
    })
    return this.process.pid!
  }
  private decode(data: Buffer, callback: (e: Error) => void) {
    if (this.options.encoding) {
      try {
        return iconv.decode(data, this.options.encoding)
      } catch (e) {
        callback(e instanceof Error ? e : Error('iconv.decode error'))
      }
    }
    return data.toString()
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