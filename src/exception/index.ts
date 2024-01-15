export class IKnownException extends Error {
  data: {
    status: number
    msg: string
  }
  constructor(data: {
    status?: number
    msg: string
  }) {
    super()
    this.data = {
      status: data.status || 0,
      msg: data.msg
    }
  }
}

export class UnauthorizedException extends IKnownException {
  constructor(message: string = 'Unauthorized') {
    super({
      status: -1,
      msg: message
    })
  }
}

export class UserPwdErrorException extends IKnownException {
  constructor(message: string = 'User or password error') {
    super({
      msg: message
    })
  }
}