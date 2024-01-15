import { Controller, All, Body } from "@nestjs/common"
import ConfigService from "../service"
import Logging from "@/common/logging/decorator"

@Controller('/config')
export default class ConfigController {
  constructor(
    private service: ConfigService
  ) { }

  @All('/setting')
  async setting() {
    return {
      shell: await this.service.getShell(),
      pty: await this.service.getPty(),
      keepProcess: await this.service.getKeepProcess()
    }
  }

  @All('/ptys')
  async ptys() {
    return this.service.getPtys()
  }

  @All('/save')
  @Logging({ description: ([data]) => Object.keys(data).map(key => `${key}:${data[key as keyof typeof data]}`).join(', ') })
  async saveShell(@Body() data: {
    shell: string
    pty: string
    keepProcess: boolean
  }) {
    await this.service.setShell(data.shell)
    await this.service.setPty(data.pty)
    await this.service.setKeepProcess(data.keepProcess)
    return {
      shell: await this.service.getShell(),
      pty: await this.service.getPty(),
      keepProcess: await this.service.getKeepProcess()
    }
  }
}