import { NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from 'rxjs/operators'

export default class EncodeJSONInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map(item => ({
          status: 1,
          info: item === undefined ? null : item
        }))
      )
  }
}