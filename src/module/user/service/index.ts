import { UserPwdErrorException } from "@/exception"
import Options from "@/options"
import UserStore from "@/service/user-store"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export default class UserService {
  @Inject() private user!: UserStore
  @Inject() private options!: Options

  async login({ username, password }: { username: string, password: string }) {

  }

  async info() {
    return {
      id: this.user.id,
      name: this.user.name
    }
  }

  pwd(password: string) {
    if (this.options.hasPassword()) {
      if (this.options.password === password) {
        this.user.setPwdAuth(password)
        return this.info()
      } else {
        throw new UserPwdErrorException
      }
    }
    return this.info()
  }
}