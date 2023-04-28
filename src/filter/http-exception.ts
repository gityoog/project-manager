import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from "@nestjs/common"
import { Response } from 'express'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'

@Catch()
export default class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    if (exception instanceof HttpException) {
      response.status(
        exception.getStatus()
      ).json({
        status: 0,
        msg: exception.message
        //, stack: exception.stack
      })
    }
    // else if (exception instanceof IKnownException) {
    //   response.status(
    //     200
    //   ).json({
    //     status: 0,
    //     msg: exception.message
    //   })
    // }
    else if (exception instanceof EntityNotFoundError) {
      response.status(
        200
      ).json({
        status: 0,
        msg: '数据不存在: ' + exception.message
      })
    }
    else if (exception instanceof Error) {
      if (response.destroyed) {
        console.error(exception)
        return
      }
      response.status(
        500
      ).json({
        status: 0,
        msg: exception.message,
        stack: exception.stack
      })
      console.error(exception.stack)
    }
  }
}