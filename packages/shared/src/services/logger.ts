import winston from 'winston';
import path from 'path';

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
      defaultMeta: { service: 'ticket-system' },
  transports: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

export class LogService {
  static info(message: string, meta?: Record<string, unknown>) {
    logger.info(message, meta);
  }

  static error(message: string, error?: Error | unknown) {
    logger.error(message, { error: error instanceof Error ? error.stack : error });
  }

  static warn(message: string, meta?: Record<string, unknown>) {
    logger.warn(message, meta);
  }

  static debug(message: string, meta?: Record<string, unknown>) {
    logger.debug(message, meta);
  }

  static child(defaultMeta: Record<string, unknown>) {
    return logger.child(defaultMeta);
  }
}