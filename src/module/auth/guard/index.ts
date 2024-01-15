import { UnauthorizedException } from '@/exception'
import UserStore from '@/service/user-store'
import { Injectable, CanActivate, ExecutionContext, Inject, } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AUTH_INFO, isAnonymous } from '../constants'

@Injectable()
export class AppAuthGuard implements CanActivate {
  @Inject() private user!: UserStore
  constructor(
    private reflector: Reflector
  ) {

  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (isAnonymous(this.reflector.getAll(AUTH_INFO, [context.getClass(), context.getHandler()]))) {
      return true
    }
    if (!this.user.authorized) {
      throw new UnauthorizedException
    }
    return true
  }
}