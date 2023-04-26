import ProjectOutputBus from "@/module/project/ouput/bus"
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
  action: 'new'
} | {
  action: 'stats',
  value: {
    cpu: string
    memory: string
  } | null
})

@Injectable()
export default class ProjectProcessBuildBus {
  private callbacks: Array<(data: data) => void> = []

  constructor(
    private output: ProjectOutputBus
  ) {
    this.output.onChange((rows) => {
      const projects = new Set<string>()
      rows.forEach(row => projects.add(row.project))
      projects.forEach(project => this.emit({ id: project, action: 'new' }))
    })
  }

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