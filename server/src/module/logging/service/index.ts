import { Injectable, Logger } from "@nestjs/common"
import LoggingEntity from "./entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import UserStore from "@/service/user-store"

@Injectable()
export default class LoggingService {
  constructor(
    @InjectRepository(LoggingEntity) private main: Repository<LoggingEntity>,
    private logger: Logger,
    private user: UserStore
  ) { }
  async query({ page = 1, size = 10, params = {} }: {
    page?: number,
    size?: number,
    params?: {}
  }) {
    const [data, total] = await this.main.findAndCount({
      where: params,
      skip: (page - 1) * size,
      take: size,
      order: {
        time: 'DESC'
      }
    })
    return {
      data, total, page
    }
  }
  save(data: {
    action: string
    target: string
    description: string
  }) {
    this.logger.log(
      `${data.action} {${this.user.ip}} ${data.description}`,
      data.target
    )
    this.main.save({
      action: data.action,
      target: data.target,
      description: data.description,
      ip: this.user.ip,
      user: this.user.name
    })
  }
  async clear() {
    await this.main.clear()
    this.save({
      target: 'Logging',
      action: 'Clear',
      description: 'Clear all logs'
    })
  }
}