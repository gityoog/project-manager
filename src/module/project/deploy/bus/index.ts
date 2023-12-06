import { Injectable } from "@nestjs/common"

type base = {
  process: string
  output: string
}

type data = base & ({
  type: 'start'
} | {
  type: 'success'
} | {
  type: 'fail'
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