import { Controller, All, Body } from "@nestjs/common"
import ConfigService from "../service"

@Controller('/config')
export default class ConfigController {
  constructor(
    private service: ConfigService
  ) { }

  @All('/setting')
  async setting() {
    return {
      shell: await this.service.getShell()
    }
  }

  @All('/shell/save')
  saveShell(@Body() data: {
    shell: string
  }) {
    return this.service.setShell(data.shell)
  }
}