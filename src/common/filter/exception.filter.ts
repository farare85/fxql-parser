import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

interface IError {
  message: string;
  code: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, code: null };

    const responseData = {
      ...message,
    };

    this.logMessage(request, message, status, exception);

    response.status(status).json(responseData);
  }

  private logMessage(
    request: any,
    message: IError,
    status: number,
    exception: any,
  ) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path} method=${request.method} status=${status} code=${
          message.code ? message.code : null
        } message=${message.message ? message.message : null} status = ${status >= 500 ? exception.stack : ''}`,
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path} method=${request.method} status=${status} code=${
          message.code ? message.code : null
        } message=${message.message ? message.message : null}`,
      );
    }
  }
}
