import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { QueryFailedError } from 'typeorm';
export default class SQLExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost): void;
}
