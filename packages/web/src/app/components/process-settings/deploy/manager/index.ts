import BasicStrategyManager from "@/common/strategy-manager"
import OutputDeployBasicEditor from "../impl/basic/editor"
import OutputDeployImpl from "../impl"
import { Concat, Service } from "ioc-di"

@Service()
export default class OutputDeployImplManager extends BasicStrategyManager<OutputDeployBasicEditor> {
  protected factory(type: string): OutputDeployBasicEditor | undefined {
    const Editor = OutputDeployImpl.find((impl) => impl.name === type)?.Editor
    if (Editor) {
      return Concat(this, new Editor)
    }
    return
  }
  get Render() {
    return this.actived?.Render || null
  }
  setData(arg?: { type?: string, data?: Json }) {
    const { type = '', data } = arg || {}
    this.active(type)
    this.actived?.setData(data)
  }
  getData(): { type: string, data: Json } | undefined {
    if (this.type) {
      return {
        type: this.type,
        data: this.actived?.getData()
      }
    } else {
      return
    }
  }
}