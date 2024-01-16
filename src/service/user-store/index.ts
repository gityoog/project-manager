import Options from "@/options"
import { Inject, Logger } from "@nestjs/common"
import { Request } from "express"
import { CLS_REQ, ClsService, InjectableProxy } from "nestjs-cls"

@InjectableProxy()
export default class UserStore {
  @Inject() private options!: Options
  id
  name
  ip
  private request
  constructor(
    @Inject(ClsService) private cls: ClsService
  ) {
    const request = this.request = cls.get<Request>(CLS_REQ)
    if (!request) {
      console.trace('request is not exist')
    } else {
      this.id = request.sessionID
      this.name = `anonymous(${this.id})`
      this.ip = request.ip
    }
  }
  get authorized() {
    if (this.options.hasPassword()) {
      return this.request.session.pwdAuth === this.options.password
    }
    return true
  }
  setPwdAuth(password?: string) {
    if (password) {
      this.request.session.pwdAuth = password
    } else {
      this.request.session.pwdAuth = undefined
    }
  }
}