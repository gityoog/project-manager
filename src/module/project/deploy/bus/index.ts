import { Injectable } from "@nestjs/common"

type base = {
  process: string
  actived: string
}

type data = base & ({
  type: 'running'
  msg: string
} | {
  type: 'success'
  msg: string
} | {
  type: 'failed'
  msg: string
})


@Injectable()
export default class ProjectDeployBus {
  private callbacks: ((data: data) => void)[] = []
  emit(data: data) {
    this.callbacks.forEach(callback => callback(data))
  }
  on(callback: (data: data) => void) {
    this.callbacks.push(callback)
  }
}