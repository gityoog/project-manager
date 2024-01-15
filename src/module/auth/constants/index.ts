import { applyDecorators, ExecutionContext, SetMetadata } from "@nestjs/common"

export const AUTH_INFO = Symbol('AUTH_INFO')
const AnonymousAuth = 'AnonymousAuth'

export function Anonymous() {
  return applyDecorators(
    SetMetadata(AUTH_INFO, AnonymousAuth)
  )
}

export function isAnonymous(info: any | any[]) {
  if (Array.isArray(info)) {
    return info.includes(AnonymousAuth)
  }
  return info === AnonymousAuth
}