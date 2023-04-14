import { Injectable } from "@nestjs/common"
import ConfigData from "./data"

@Injectable()
export default class ConfigService {
  constructor(
    private data: ConfigData
  ) { }

  async getShell() {
    return this.data.get('shell')
  }
  async setShell(value: string) {
    return this.data.set('shell', value)
  }
}