import { IKnownException } from "@/exception"
import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from "@nestjs/common"
import { Response } from 'express'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import { QueryFailedError } from 'typeorm'

@Catch()
export default class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    if (exception instanceof QueryFailedError) {
      const result = /UNIQUE constraint failed: (.+?)\.(.*?)$/.exec(exception.message)
      if (result) {
        response.status(200).json({
          status: 0,
          msg: `${result[2]} is exist`
        })
      } else {
        response.status(200).json({
          status: 0,
          msg: exception.message
        })
        console.error(exception)
      }
    }
    else if (exception instanceof EntityNotFoundError) {
      response.status(200).json({
        status: 0,
        msg: 'Entity Not Found: ' + exception.message
      })
    }
    else if (exception instanceof IKnownException) {
      response.status(200).json(exception.data)
    }
    else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        status: 0,
        msg: exception.message
        //, stack: exception.stack
      })
    }
    else if (exception instanceof Error) {
      if (response.destroyed) {
        console.error(exception)
        return
      }
      response.status(500).json({
        status: 0,
        msg: exception.message,
        stack: exception.stack
      })
      console.error(exception.stack)
    }
  }
}