import { Controller, All, Body } from "@nestjs/common"
import Logging from "@/common/logging/decorator"
import UserService from "../service"
import { Anonymous } from "@/module/auth/constants"

@Controller('/user')
export default class UserController {
  constructor(
    private service: UserService
  ) { }

  @All('/login')
  @Logging({ description: ([data]) => data.username })
  @Anonymous()
  async login(@Body() data: {
    username: string
    password: string
  }) {

  }

  @All('/pwd')
  @Logging({ description: ([data], result) => result.name || '' })
  @Anonymous()
  async pwd(@Body() data: {
    pwd: string
  }) {
    return this.service.pwd(data.pwd)
  }
}