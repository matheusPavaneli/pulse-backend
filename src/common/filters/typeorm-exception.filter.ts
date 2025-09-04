import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = exception as QueryFailedError & {
      code: string;
      detail?: string;
      column?: string;
      constraint?: string;
    };

    const baseResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    switch (error.code) {
      case '23505': {
        const match = error.detail?.match(/\(([^)]+)\)=\(([^)]+)\)/);
        const fields = match?.[1]?.split(',').map((f) => f.trim()) || [];
        const values = match?.[2]?.split(',').map((v) => v.trim()) || [];

        const conflict = Object.fromEntries(
          fields.map((f, i) => [f, values[i]]),
        );

        return response.status(HttpStatus.CONFLICT).json({
          ...baseResponse,
          statusCode: HttpStatus.CONFLICT,
          message: `Conflict: duplicate value${fields.length > 1 ? 's' : ''}`,
          conflict,
        });
      }

      case '23503': {
        const message = `Foreign key constraint failed: related entity not found.`;
        return response.status(HttpStatus.BAD_REQUEST).json({
          ...baseResponse,
          statusCode: HttpStatus.BAD_REQUEST,
          message,
          constraint: error.constraint,
        });
      }

      case '23502': {
        const columnMatch = error.message?.match(
          /null value in column "(.*?)"/,
        );
        const column = columnMatch?.[1] || error.column || 'unknown';
        return response.status(HttpStatus.BAD_REQUEST).json({
          ...baseResponse,
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Missing required field: "${column}"`,
          field: column,
        });
      }

      case '22P02': {
        return response.status(HttpStatus.BAD_REQUEST).json({
          ...baseResponse,
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Invalid value format: check input types`,
        });
      }

      default: {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          ...baseResponse,
          message: error.message || 'Database error',
        });
      }
    }
  }
}
