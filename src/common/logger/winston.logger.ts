import { Environment } from 'src/config/environment-config/environment-config.validation';
import { createLogger, format, transports } from 'winston';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

dotenvConfig({ path: join(__dirname, '..', '..', '..', '.env') });

const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

const options = {
  file: {
    filename: 'error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
};

// for development environment
const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [new transports.Console(options.console)],
};

// for production environment
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: 'combine.log',
      level: 'all',
    }),
  ],
};

const instanceLogger =
  process.env.NODE_ENV === Environment.Development ? prodLogger : devLogger;
console.log(instanceLogger);
export const instance = createLogger(instanceLogger);
