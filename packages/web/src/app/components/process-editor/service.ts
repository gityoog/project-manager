import { Inject, Service } from "ioc-di"
import { iProcessEditor } from "."
import IProcessSettings from "../process-settings/service"
import LocaleService from "@/app/common/locale"

type data = {
  id: string
  name: string
  context: string
  command: string
  env?: Record<string, string>
  encoding?: string
  autostart?: boolean
  deploy?: Record<string, any>
}

const def = () => ({
  id: '',
  name: '',
  context: '',
  command: ''
} as data)

@Service()
export default class IProcessEditor implements iProcessEditor {
  @Inject() locale!: LocaleService
  @Inject() private settings!: IProcessSettings
  data: data[] = [def()]
  add() {
    this.data.push({
      id: '',
      name: this.locale.t.project.process.namePrefix + (this.data.length),
      context: this.data[0].context,
      command: ''
    })
  }
  remove(index: number) {
    if (index !== 0) {
      this.data.splice(index, 1)
    }
  }
  setting(index: number) {
    this.settings.open(this.data[index], data => {
      this.data[index] = {
        ...this.data[index],
        ...data
      }
    })
  }
  hasBadge(index: number) {
    return false
    return !!(this.data[index].encoding || this.data[index].env || this.data[index].autostart)
  }
  setData(data: data[]) {
    this.data = data.map((item, index) => ({
      default: index === 0,
      id: item.id,
      name: item.name,
      context: item.context,
      command: item.command,
      encoding: item.encoding || '',
      env: item.env ? { ...item.env } : undefined,
      autostart: item.autostart,
      deploy: item.deploy
    }))
    if (this.data.length === 0) {
      this.data = [def()]
    }
  }
  getData(): data[] {
    return this.data.map(item => ({
      id: item.id,
      name: item.name,
      context: item.context,
      command: item.command,
      encoding: item.encoding || undefined,
      env: item.env ? { ...item.env } : undefined,
      autostart: item.autostart,
      deploy: item.deploy
    }))
  }
}