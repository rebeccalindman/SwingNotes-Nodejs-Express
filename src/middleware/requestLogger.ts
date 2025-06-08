
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const userId = req.user?.id || 'anonymous';

    logger.info(
      `${method} ${originalUrl} ${statusCode} - ${duration}ms (user: ${userId})`
    );
  });

  next();
}