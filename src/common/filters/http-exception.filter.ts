import {
  Catch,
  HttpException,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { url }: { url: string } = ctx.getRequest<Request>();
    const statusCode: number = exception.getStatus() || 500;
    const res: string | object = exception.getResponse();

    const errorMessage =
      typeof res === 'object' && res !== null && 'message' in res
        ? res.message
        : res;

    response.status(statusCode).json({
      success: false,
      statusCode,
      path: url,
      message: 'Request failed',
      error: errorMessage,
    });
  }
}
