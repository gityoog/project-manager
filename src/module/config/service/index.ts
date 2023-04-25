import PtyService from "@/common/pty"
import { Injectable } from "@nestjs/common"
import ConfigData from "./data"

@Injectable()
export default class ConfigService {
  constructor(
    private data: ConfigData
  ) { }
  async getPtys() {
    return PtyService.Types
  }
  async getPty() {
    return this.data.get('pty')
  }
  async setPty(value: string) {
    return this.data.set('pty', value)
  }
  async getShell() {
    return this.data.get('shell')
  }

  async setShell(value: string) {
    return this.data.set('shell', value)
  }
}