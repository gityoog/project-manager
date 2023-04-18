import { Injectable } from "@nestjs/common"

type project = {
  id: string
}

type data = project & ({
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
})

@Injectable()
export default class ProjectProcessDevBus {
  private callbacks: Array<(data: data) => void> = []
  emit(data: data) {
    this.callbacks.forEach(callback => callback(data))
  }

  on(callback: (data: data) => void) {
    this.callbacks.push(callback)
    return () => {
      const index = this.callbacks.indexOf(callback)
      if (index > -1) {
        this.callbacks.splice(index, 1)
      }
    }
  }

}