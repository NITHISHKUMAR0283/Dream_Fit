import { Request, Response, NextFunction } from 'express';
import logger, { logRequest } from '../utils/logger';

interface RequestWithStartTime extends Request {
  startTime?: number;
}

export const requestLogger = (req: RequestWithStartTime, res: Response, next: NextFunction) => {
  req.startTime = Date.now();

  // Override res.end to capture response data
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const responseTime = req.startTime ? Date.now() - req.startTime : undefined;

    // Log the request with response details
    logRequest(req, res.statusCode, responseTime);

    // Call the original end function
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

export default requestLogger;