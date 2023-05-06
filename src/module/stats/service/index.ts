import { Injectable, Logger } from "@nestjs/common"
import pidusage from 'pidusage'
import os from 'os'

type stats = {
  cpu: string
  memory: string
}

@Injectable()
export default class StatsService {
  private cores = os.cpus().length
  constructor(
    private logger: Logger
  ) {

  }
  private status = false
  private index = 0
  private timeout?: NodeJS.Timeout
  start() {
    if (this.status) return
    this.status = true
    this.query()
    this.logger.debug("Start", 'StatsService')
  }
  stop() {
    if (!this.status) return
    this.status = false
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }
    this.logger.debug("Stop", 'StatsService')
  }
  private callback?: (data: stats) => void
  onData(callback: (data: stats) => void) {
    this.callback = callback
  }
  private query() {
    const index = ++this.index
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }
    pidusage(process.pid, (err, stats) => {
      if (err) return this.logger.log("QueryPidusage Error", 'StatsService')
      if (index !== this.index) return
      if (!this.status) return
      this.callback?.({
        cpu: (stats.cpu / this.cores).toFixed(2) + '%',
        memory: (stats.memory / 1024 / 1024).toFixed(2) + 'MB'
      })
      this.timeout = setTimeout(() => this.query(), 1000)
    })
  }
}