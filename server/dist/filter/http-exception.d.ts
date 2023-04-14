import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
export default class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
