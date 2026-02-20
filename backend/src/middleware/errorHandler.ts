import { Request, Response, NextFunction } from 'express';
import logger, { logError, logSecurityEvent } from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number;
}

// Async error handler wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error classification
const isOperationalError = (error: AppError): boolean => {
  return error.isOperational === true;
};

// Send error response
const sendErrorResponse = (error: AppError, req: Request, res: Response) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = error.statusCode || 500;

  // Log security-related errors
  if (statusCode === 401 || statusCode === 403) {
    logSecurityEvent('Authentication/Authorization Error', {
      message: error.message,
      statusCode,
    }, req);
  }

  const response: any = {
    success: false,
    message: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Include stack trace in development
  if (isDevelopment) {
    response.stack = error.stack;
  }

  // Include request ID if available
  if (req.headers['x-request-id']) {
    response.requestId = req.headers['x-request-id'];
  }

  res.status(statusCode).json(response);
};

// Handle specific MongoDB errors
const handleMongoError = (error: any): AppError => {
  let message = 'Database operation failed';
  let statusCode = 500;

  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate field value';
    statusCode = 400;
  }

  // Validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors || {}).map((err: any) => err.message);
    message = `Validation Error: ${errors.join(', ')}`;
    statusCode = 400;
  }

  // Cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    message = 'Invalid ID format';
    statusCode = 400;
  }

  const appError: AppError = new Error(message);
  appError.statusCode = statusCode;
  appError.isOperational = true;
  return appError;
};

// Handle JWT errors
const handleJWTError = (error: any): AppError => {
  let message = 'Authentication failed';
  let statusCode = 401;

  if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    message = 'Token expired';
  }

  const appError: AppError = new Error(message);
  appError.statusCode = statusCode;
  appError.isOperational = true;
  return appError;
};

// Main error handler middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let handledError = error;

  // Handle specific error types
  if (error.name === 'CastError' || error.name === 'ValidationError' || error.code === 11000) {
    handledError = handleMongoError(error);
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    handledError = handleJWTError(error);
  }

  // Log error with context
  logError(handledError, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method !== 'GET' ? req.body : undefined,
    params: req.params,
    query: req.query,
    userId: (req as any).user?.id,
  });

  // Send appropriate response
  if (isOperationalError(handledError) || handledError.statusCode) {
    sendErrorResponse(handledError, req, res);
  } else {
    // Unexpected errors - don't leak error details in production
    const message = process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : handledError.message;

    handledError.message = message;
    handledError.statusCode = 500;
    sendErrorResponse(handledError, req, res);
  }
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  const message = `Route ${req.originalUrl} not found`;

  logSecurityEvent('404 Error', {
    url: req.originalUrl,
    method: req.method,
  }, req);

  res.status(404).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

export default errorHandler;