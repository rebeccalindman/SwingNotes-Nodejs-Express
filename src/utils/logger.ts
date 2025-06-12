// src/utils/logger.ts
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const createDailyRotateTransport = (filenameBase: string, level = 'info') =>
  new DailyRotateFile({
    filename: path.join(LOG_DIR, `${filenameBase}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '14d',
    level,
  });

const isDev = process.env.NODE_ENV !== 'production';

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'warn'),
  format: combine(
    label({ label: 'SwingNotes' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ' }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    createDailyRotateTransport('combined'),
    createDailyRotateTransport('error', 'error'),
  ],
  exceptionHandlers: [createDailyRotateTransport('exceptions', 'error')],
  rejectionHandlers: [createDailyRotateTransport('rejections', 'error')],
});

export default logger;
