import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from 'typeorm'
import os from 'os'
import ConfigEntity from "../entity"

type item = {
  name: string
  default: () => string
}
type data = {
  shell: item
}

@Injectable()
export default class ConfigData {
  private data: data = {
    shell: {
      name: 'shell',
      default: () => os.platform() === 'win32' ? 'cmd.exe /C' : 'sh -c'
    }
  }
  private cache: {
    [key in keyof data]?: string
  } = {}
  constructor(
    @InjectRepository(ConfigEntity) private main: Repository<ConfigEntity>,
  ) {

  }
  async set(key: keyof data, value: string) {
    const item = this.data[key]
    const config = await this.main.findOneBy({ name: item.name })
    if (config) {
      config.value = value
      await this.main.save(config)
    } else {
      await this.main.save({ name: item.name, value })
    }
    this.cache[key] = value
  }
  async get(key: keyof data) {
    const item = this.data[key]
    if (this.cache[key]) {
      return this.cache[key]!
    }
    const config =
      await this.main.findOneBy({ name: item.name })
      || await this.main.save({ name: item.name, value: item.default() })
    this.cache[key] = config.value
    return this.cache[key]!
  }

}