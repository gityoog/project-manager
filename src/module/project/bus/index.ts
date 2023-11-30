import ProjectEntity from "../service/entity"
import { Injectable } from "@nestjs/common"
import EntitySubscriber from "@/common/entity-subscriber"
import { diff } from "@/common/utils/json"

type process = App.Project.Process.Config
type processCb = (process: process, project: string) => void

@Injectable()
export default class ProjectBus extends EntitySubscriber<ProjectEntity> {
  protected Entity = ProjectEntity

  constructor() {
    super()
    this.onUpdate((project, origin) => {
      if (origin) {
        const originProcess: Record<string, process> = {}
        origin.process?.forEach(process => {
          originProcess[process.id] = process
        })
        const newProcess: Record<string, process> = {}
        project.process?.forEach(process => {
          newProcess[process.id] = process
        })

        for (const id in originProcess) {
          if (!newProcess[id]) {
            this.processRemoveCallbacks.forEach(callback => callback(originProcess[id], project.id))
          } else {
            if (diff(originProcess[id], newProcess[id])) {
              this.processUpdateCallbacks.forEach(callback => callback(newProcess[id], project.id))
            }
          }
        }
      }
    })
    this.onRemove((project) => {
      project.process?.forEach(process => {
        this.processRemoveCallbacks.forEach(callback => callback(process, project.id))
      })
    })
  }

  private processUpdateCallbacks: Array<processCb> = []
  onProcessUpdate(callback: processCb) {
    this.processUpdateCallbacks.push(callback)
  }

  private processRemoveCallbacks: Array<processCb> = []
  onProcessRemove(callback: processCb) {
    this.processRemoveCallbacks.push(callback)
  }
}