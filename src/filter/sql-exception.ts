import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common"
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'

@Catch(QueryFailedError)
export default class SQLExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const result = /UNIQUE constraint failed: (.+?)\.(.*?)$/.exec(exception.message)
    if (result) {
      response.status(200).json({
        status: 0,
        msg: `${result[2]}重复`
      })
    } else {
      response.status(200).json({
        status: 0,
        msg: exception.message
      })
      console.error(exception)
    }
  }
}