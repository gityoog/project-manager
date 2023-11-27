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
      pty: await this.service.getPty()
    }
  }

  @All('/ptys')
  async ptys() {
    return this.service.getPtys()
  }

  @All('/save')
  @Logging({ description: ([data]) => `shell: ${data.shell}, pty: ${data.pty}` })
  async saveShell(@Body() data: {
    shell: string
    pty: string
  }) {
    await this.service.setShell(data.shell)
    await this.service.setPty(data.pty)
    return {
      shell: await this.service.getShell(),
      pty: await this.service.getPty()
    }
  }
}