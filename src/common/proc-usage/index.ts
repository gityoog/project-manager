import { execFile } from 'child_process'
import os from 'os'

type proc = {
  pid: number
  ppid: number | null
  cpu: number
  mem: number
  children: proc[]
}

namespace ProcUsage {
  export type Proc = proc
}

class ProcUsage {
  static index: number = 0
  static cache?: ProcUsage
  static factory() {
    this.index++
    if (this.cache) return ProcUsage.cache!
    return this.cache = new ProcUsage()
  }
  private dict: Record<number, proc> = {}
  private running = false
  private waiting = false
  private callbacks: Array<() => void> = []

  get(pid: number, callback: (usage: proc | null) => void) {
    this.getUsage(() => {
      callback(this.dict[pid] || null)
    })
  }

  private getUsage(callback: () => void) {
    if (this.running) {
      this.callbacks.push(callback)
    } else if (this.waiting) {
      callback()
    } else {
      this.callbacks.push(callback)
      this.running = true
      this.query(() => {
        this.waiting = true
        this.running = false
        setTimeout(() => {
          this.waiting = false
        }, 1000)
        for (const fn of this.callbacks) {
          fn()
        }
        this.callbacks = []
      })
    }
  }
  private query(callback: () => void) {
    if (os.platform() === 'win32') {
      this.wmic(callback)
    } else {
      this.ps(callback)
    }
  }
  private update(proc: {
    pid: string
    ppid: string
    cpu: string
    mem: string
  }[], callback: () => void) {
    const dict: Record<number, proc> = {}
    proc.forEach(item => {
      const ppid = parseInt(item.ppid)
      const pid = parseInt(item.pid)
      if (!dict[pid]) {
        dict[pid] = { pid, ppid, cpu: 0, mem: 0, children: [] }
      }
      if (!dict[ppid]) {
        dict[ppid] = { pid: ppid, ppid: null, cpu: 0, mem: 0, children: [] }
      }
      dict[pid].cpu = Number.parseFloat(item.cpu)
      dict[pid].mem = Number.parseFloat(item.mem)
      dict[ppid].children.push(dict[pid])
    })
    this.dict = dict
    callback()
  }

  private wmic(callback: () => void) {
    execFile('wmic', ['process', 'get', 'ProcessId,ParentProcessId,WorkingSetSize'], (err, stdout, stderr) => {
      execFile('wmic', ['path', 'Win32_PerfFormattedData_PerfProc_Process', 'get', 'IDProcess,PercentProcessorTime'], (err, stdout2, stderr) => {
        if (err) {
          return this.update([], callback)
        }
        const task = parseTable<{
          processid: string
          parentprocessid: string
          workingsetsize: string
        }>(stdout, 3)
        const info = parseTable<{
          idprocess: string
          percentprocessortime: string
        }>(stdout2, 2)
        const dict: Record<number, string> = {}
        info.forEach(item => {
          dict[parseInt(item.idprocess)] = item.percentprocessortime
        })
        this.update(task.map(item => {
          return {
            pid: item.processid,
            ppid: item.parentprocessid,
            cpu: dict[parseInt(item.processid)],
            mem: item.workingsetsize
          }
        }), callback)
      })
    })
  }

  private ps(callback: () => void) {
    const args = os.platform() === 'aix' ? 'pid,ppid,pcpu,rssize' : 'pid,ppid,pcpu,rss'
    execFile('ps', ['a', '-o', args], (err, stdout, stderr) => {
      if (err) {
        return this.update([], callback)
      }
      const lines = stdout.trim().split(/[\n\r]+/)
      lines.splice(0, 1)
      lines.unshift('pid ppid cpu mem')
      this.update(
        parseTable<{
          pid: string
          ppid: string
          cpu: string
          mem: string
        }>(lines.join('\n'), 4), callback)
    })
  }

  private _destroy() {
    this.callbacks = null!
    this.dict = null!
  }

  destroy() {
    ProcUsage.index--
    if (ProcUsage.index === 0) {
      this._destroy()
      ProcUsage.cache = undefined
    }
  }
}

function parseTable<T extends Record<string, string>>(output: string, count: number): T[] {
  const lines = output.trim().split(/[\n\r]+/).map(item => item.trim().split(/\s+/))
  const keys = lines.shift()!.map(item => item.toLowerCase())
  const result: Record<string, string>[] = []
  if (keys.length !== count) {
    return []
  }
  for (const line of lines) {
    if (line.length !== count) {
      continue
    }
    const item: Record<string, string> = {}
    for (let i = 0; i < keys.length; i++) {
      item[keys[i]] = line[i]
    }
    result.push(item)
  }
  return result as T[]
}

export default ProcUsage