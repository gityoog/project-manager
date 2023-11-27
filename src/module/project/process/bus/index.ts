import EntitySubscriber from "@/common/entity-subscriber"
import { Injectable } from "@nestjs/common"

type base = {
  id: string
  project: string
  default?: boolean
}

type data = base & ({
  action: 'status'
  value: boolean
} | {
  action: 'stdout'
  value: string
} | {
  action: 'url'
  value: {
    host: string
    port: string
  } | null
} | {
  action: 'stats'
  value: {
    cpu: string
    memory: string
  } | null
} | {
  action: 'file'
})

@Injectable()
export default class ProjectProcessBus {
  private callbacks: ((data: data) => void)[] = []
  emit(data: data) {
    this.callbacks.forEach(callback => callback(data))
  }
  on(callback: (data: data) => void) {
    this.callbacks.push(callback)
  }
  private stdinCallbacks: Record<string, ((data: string) => void)[]> = {}
  stdin({ id, value }: { id: string, value: string }) {
    if (this.stdinCallbacks[id]) {
      this.stdinCallbacks[id].forEach(callback => callback(value))
    }
  }
  onStdin(id: string, callback: (data: string) => void) {
    this.stdinCallbacks[id] = this.stdinCallbacks[id] || []
    this.stdinCallbacks[id].push(callback)
  }
  offStdin(id: string, callback: (data: string) => void) {
    if (this.stdinCallbacks[id]) {
      const index = this.stdinCallbacks[id].indexOf(callback)
      if (index !== -1) {
        this.stdinCallbacks[id].splice(index, 1)
      }
    }
  }
}