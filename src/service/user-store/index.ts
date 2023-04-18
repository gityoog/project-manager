import { Inject, Logger } from "@nestjs/common"
import { Request } from "express"
import { ClsService, InjectableProxy } from "nestjs-cls"

@InjectableProxy()
export default class UserStore {
  id
  name
  ip
  constructor(
    @Inject(ClsService) private cls: ClsService
  ) {
    const request = cls.get<Request>('request')
    this.id = request.sessionID
    this.name = request.session.name || `anonymous(${this.id})`
    this.ip = request.ip
  }
  get token() {
    const token = this.cls.get('token') as string | undefined
    if (!token) {
      throw new Error('token is not exist')
    }
    return token
  }
}