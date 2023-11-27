import { Injectable, Logger } from "@nestjs/common"
import LoggingEntity from "./entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import UserStore from "@/service/user-store"
import LoggingContext from "@/common/logging"

enum Status {
  success = '1',
  fail = '0'
}

@Injectable()
export default class LoggingService {
  constructor(
    @InjectRepository(LoggingEntity) private main: Repository<LoggingEntity>,
    private logger: Logger,
    private user: UserStore,
    private context: LoggingContext
  ) {
    this.context.onSuccess((name, action, description) => {
      this.success({
        action,
        target: name,
        description: description || ''
      })
    })
    this.context.onFail((name, action, description) => {
      this.fail({
        action,
        target: name,
        description: description || ''
      })
    })
  }
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
  success(data: {
    action: string
    target: string
    description: string
  }) {
    this.save({ ...data, status: Status.success })
  }
  fail(data: {
    action: string
    target: string
    description: string
  }) {
    this.save({ ...data, status: Status.fail })
  }
  private save(data: {
    action: string
    target: string
    description: string
    status?: Status
  }) {
    data.status = data.status ?? Status.success
    this.logger.log(
      `${data.action} {${this.user.ip}} ${data.description} ${parseEnum(Status, data.status)}`,
      data.target
    )
    this.main.save({
      action: data.action,
      target: data.target,
      description: data.description,
      ip: this.user.ip,
      user: this.user.name,
      status: data.status
    })
  }
  async clear() {
    await this.main.clear()
  }
}

function parseEnum<T extends object>(e: T, value: string): string {
  for (const key in e) {
    if (e[key as keyof T] === value) {
      return key
    }
  }
  return value
}