import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define the format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define the format for file logs (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }),

  // File transport for errors
  new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    format: fileFormat,
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
  }),

  // File transport for all logs
  new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    format: fileFormat,
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Error logging function with context
export const logError = (error: Error, context?: any) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

// Request logging function
export const logRequest = (req: any, statusCode: number, responseTime?: number) => {
  logger.http('HTTP Request', {
    method: req.method,
    url: req.url,
    statusCode,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    responseTime: responseTime ? `${responseTime}ms` : undefined,
    timestamp: new Date().toISOString(),
  });
};

// Security event logging
export const logSecurityEvent = (event: string, details: any, req?: any) => {
  logger.warn('Security Event', {
    event,
    details,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    url: req?.url,
    timestamp: new Date().toISOString(),
  });
};

// Business event logging
export const logBusinessEvent = (event: string, details: any, userId?: string) => {
  logger.info('Business Event', {
    event,
    details,
    userId,
    timestamp: new Date().toISOString(),
  });
};

export default logger;