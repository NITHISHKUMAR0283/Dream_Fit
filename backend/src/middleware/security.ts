import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';
import { config } from '../config/env';
import { logSecurityEvent } from '../utils/logger';

// Rate limiting middleware
export const createRateLimit = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) => {
  return rateLimit({
    windowMs: options.windowMs || config.rateLimit.windowMs,
    max: options.max || config.rateLimit.maxRequests,
    message: {
      success: false,
      message: options.message || 'Too many requests from this IP, please try again later.',
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator || ((req: Request) => req.ip),
    handler: (req: Request, res: Response) => {
      logSecurityEvent('Rate limit exceeded', {
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method
      }, req);

      res.status(429).json({
        success: false,
        message: options.message || 'Too many requests from this IP, please try again later.',
        timestamp: new Date().toISOString()
      });
    }
  });
};

// Slow down middleware for gradual response delays
export const createSlowDown = (options: {
  windowMs?: number;
  delayAfter?: number;
  delayMs?: number;
}) => {
  return slowDown({
    windowMs: options.windowMs || config.rateLimit.windowMs,
    delayAfter: options.delayAfter || config.slowDown.delayAfter,
    delayMs: options.delayMs || config.slowDown.delayMs,
    onLimitReached: (req: Request) => {
      logSecurityEvent('Slow down limit reached', {
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method
      }, req);
    }
  });
};

// Specific rate limits for different endpoints
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later.'
});

export const passwordResetRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: 'Too many password reset attempts, please try again later.'
});

export const uploadRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: 'Too many upload attempts, please try again later.'
});

export const orderRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 orders per window
  message: 'Too many order attempts, please wait before placing another order.'
});

// MongoDB injection protection
export const mongoSanitizer = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }: { req: Request; key: string }) => {
    logSecurityEvent('MongoDB injection attempt detected', {
      key,
      value: req.body[key],
      endpoint: req.originalUrl
    }, req);
  }
});

// XSS protection
export const xssProtection = xss({
  onIgnored: (input: string, context: string) => {
    console.warn(`XSS attempt blocked: ${input} in ${context}`);
  }
});

// HTTP Parameter Pollution protection
export const hppProtection = hpp({
  whitelist: ['sizes', 'colors', 'tags'], // Allow arrays for these parameters
});

// Request ID middleware for tracking
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string ||
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
};

// CORS security headers
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https:; " +
    "font-src 'self' https:; " +
    "object-src 'none'; " +
    "media-src 'self'; " +
    "frame-src 'none';"
  );

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  next();
};

// IP whitelist/blacklist middleware
export const ipFilter = (whitelist?: string[], blacklist?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip;

    // Check blacklist first
    if (blacklist && blacklist.includes(clientIp)) {
      logSecurityEvent('Blacklisted IP attempt', {
        ip: clientIp,
        endpoint: req.originalUrl
      }, req);

      return res.status(403).json({
        success: false,
        message: 'Access denied',
        timestamp: new Date().toISOString()
      });
    }

    // Check whitelist if provided
    if (whitelist && whitelist.length > 0 && !whitelist.includes(clientIp)) {
      logSecurityEvent('Non-whitelisted IP attempt', {
        ip: clientIp,
        endpoint: req.originalUrl
      }, req);

      return res.status(403).json({
        success: false,
        message: 'Access denied',
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

// Suspicious activity detection
export const suspiciousActivityDetector = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript protocol
    /eval\(/i, // Code execution attempts
    /document\.cookie/i, // Cookie theft attempts
  ];

  const requestData = JSON.stringify({
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers
  });

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestData)) {
      logSecurityEvent('Suspicious activity detected', {
        pattern: pattern.toString(),
        request: {
          url: req.originalUrl,
          method: req.method,
          query: req.query,
          body: req.body
        }
      }, req);

      return res.status(400).json({
        success: false,
        message: 'Suspicious request detected',
        timestamp: new Date().toISOString()
      });
    }
  }

  next();
};

// User agent validation
export const validateUserAgent = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent');

  if (!userAgent) {
    logSecurityEvent('Missing User-Agent header', {
      endpoint: req.originalUrl
    }, req);

    return res.status(400).json({
      success: false,
      message: 'Invalid request',
      timestamp: new Date().toISOString()
    });
  }

  // Block known bad user agents
  const blockedUserAgents = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i
  ];

  for (const pattern of blockedUserAgents) {
    if (pattern.test(userAgent)) {
      logSecurityEvent('Blocked user agent detected', {
        userAgent,
        endpoint: req.originalUrl
      }, req);

      return res.status(403).json({
        success: false,
        message: 'Access denied',
        timestamp: new Date().toISOString()
      });
    }
  }

  next();
};

export default {
  createRateLimit,
  createSlowDown,
  authRateLimit,
  passwordResetRateLimit,
  uploadRateLimit,
  orderRateLimit,
  mongoSanitizer,
  xssProtection,
  hppProtection,
  requestId,
  securityHeaders,
  ipFilter,
  suspiciousActivityDetector,
  validateUserAgent
};