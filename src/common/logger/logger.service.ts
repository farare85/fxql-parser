import { Injectable, Logger } from '@nestjs/common';
import { Environment } from '../../config/environment-config/environment-config.validation';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerService {
  private logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} [${level}]: ${message}`,
      ),
    ),
    transports: [
      process.env.NODE_ENV === Environment.Development
        ? new transports.Console()
        : new transports.File({ filename: 'fxql-parser.log' }),
    ],
  });
  log(level: string, message: string) {
    this.logger.log(level, message);
  }

  info(message: string) {
    this.log('info', message);
  }

  debug(message: string) {
    this.log('debug', message);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  error(message: string) {
    this.log('error', message);
  }
}
