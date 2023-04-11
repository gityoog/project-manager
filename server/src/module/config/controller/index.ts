import { Controller } from "@nestjs/common"
import ConfigService from "../service"

@Controller('/config')
export default class ConfigController {
  constructor(
    private service: ConfigService
  ) { }
}