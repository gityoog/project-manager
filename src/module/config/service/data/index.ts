import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from 'typeorm'
import os from 'os'
import ConfigEntity from "../entity"
import LoggingService from "@/module/logging/service"
import PtyService from "@/common/pty"

type Item<T = string> = {
  name: string
  default: () => T
}
type data = {
  shell: Item
  pty: Item<PtyService.Type>
}

@Injectable()
export default class ConfigData {
  private data: data = {
    shell: {
      name: 'shell',
      default: () => os.platform() === 'win32' ? 'cmd.exe /C' : 'sh -c'
    },
    pty: {
      name: 'pty',
      default: () => PtyService.Types[0].value
    }
  }
  private cache: {
    [key in keyof data]?: string
  } = {}
  constructor(
    @InjectRepository(ConfigEntity) private main: Repository<ConfigEntity>
  ) { }
  async set(key: keyof data, value: string) {
    if (await this.get(key) !== value) {
      const item = this.data[key]
      await this.save(item.name, value)
      this.cache[key] = value
    }
  }
  async get<K extends keyof data>(key: K) {
    if (!(key in this.cache)) {
      const item = this.data[key]
      const row = await this.main.findOneBy({ name: item.name })
      if (row) {
        this.cache[key] = row.value
      } else {
        const value = item.default()
        await this.save(item.name, value)
        this.cache[key] = value
      }
    }
    return this.cache[key]! as ReturnType<data[K]['default']>
  }

  private async save(name: string, value: string) {
    const row = await this.main.findOneBy({ name })
    if (row) {
      await this.main.save(this.main.merge(row, { value }))
    } else {
      await this.main.save({ name, value })
    }
  }
}