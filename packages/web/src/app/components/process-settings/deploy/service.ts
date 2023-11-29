import { Inject, Service } from "ioc-di"
import { iOutputDeploySettings } from "."
import OutputDeployImpl from "./impl"
import OutputDeployImplManager from "./manager"
import LocaleService from "@/app/common/locale"

@Service()
export default class IOutputDeploySettings implements iOutputDeploySettings {
  @Inject() private manager!: OutputDeployImplManager
  @Inject() locale!: LocaleService

  types = OutputDeployImpl.map((impl) => ({ type: impl.name, name: impl.name }))
  get type() {
    return this.manager.type
  }
  get Render() {
    return this.manager.Render
  }
  setType(type: string) {
    this.manager.active(type)
  }
  setData(data?: {
    type?: string
    data?: Json
  }) {
    this.manager.setData(data)
  }
  getData() {
    return this.manager.getData()
  }
}