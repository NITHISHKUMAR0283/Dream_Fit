import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { logBusinessEvent } from '../utils/logger';

// Response time tracking
export const responseTimeTracker = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;

    // Log slow requests
    if (responseTime > 1000) {
      logBusinessEvent('Slow response detected', {
        url: req.originalUrl,
        method: req.method,
        responseTime: `${responseTime}ms`,
        statusCode: res.statusCode
      });
    }

    // Add response time header
    res.setHeader('X-Response-Time', `${responseTime}ms`);
  });

  next();
};

// Smart compression middleware
export const smartCompression = compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req: Request, res: Response) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }

    // Compress responses based on content type
    const contentType = res.getHeader('content-type') as string;
    if (contentType) {
      return /text|json|javascript|css|xml|svg/.test(contentType);
    }

    return compression.filter(req, res);
  },
});

// Request size limiter
export const requestSizeLimiter = (maxSize: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (contentLength > maxSize) {
      logBusinessEvent('Large request blocked', {
        url: req.originalUrl,
        method: req.method,
        contentLength: `${contentLength} bytes`,
        maxAllowed: `${maxSize} bytes`
      });

      return res.status(413).json({
        success: false,
        message: 'Request entity too large',
        maxSize: `${maxSize} bytes`,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

// Bandwidth monitoring
export const bandwidthMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  let bytesRead = 0;
  let bytesWritten = 0;

  // Monitor request data
  const originalRead = req.read;
  req.read = function(size?: number) {
    const chunk = originalRead.call(this, size);
    if (chunk) {
      bytesRead += chunk.length;
    }
    return chunk;
  };

  // Monitor response data
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function(chunk: any, encoding?: any, callback?: any) {
    if (chunk) {
      bytesWritten += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
    }
    return originalWrite.call(this, chunk, encoding, callback);
  };

  res.end = function(chunk?: any, encoding?: any, callback?: any) {
    if (chunk) {
      bytesWritten += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
    }

    const duration = Date.now() - startTime;
    const totalBytes = bytesRead + bytesWritten;

    // Log bandwidth usage
    if (totalBytes > 1024 * 1024) { // Log if > 1MB
      logBusinessEvent('High bandwidth usage', {
        url: req.originalUrl,
        method: req.method,
        bytesRead,
        bytesWritten,
        totalBytes,
        duration: `${duration}ms`,
        throughput: `${(totalBytes / duration * 1000 / 1024).toFixed(2)} KB/s`
      });
    }

    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
};

// CPU usage monitoring middleware
export const cpuMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startCpuUsage = process.cpuUsage();
  const startTime = process.hrtime();

  res.on('finish', () => {
    const cpuUsage = process.cpuUsage(startCpuUsage);
    const duration = process.hrtime(startTime);
    const durationMs = duration[0] * 1000 + duration[1] / 1000000;

    // Calculate CPU percentage
    const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000 / durationMs) * 100;

    // Log high CPU usage
    if (cpuPercent > 80) {
      logBusinessEvent('High CPU usage detected', {
        url: req.originalUrl,
        method: req.method,
        cpuPercent: `${cpuPercent.toFixed(2)}%`,
        duration: `${durationMs.toFixed(2)}ms`,
        userCpu: `${cpuUsage.user / 1000}ms`,
        systemCpu: `${cpuUsage.system / 1000}ms`
      });
    }
  });

  next();
};

// Memory usage monitoring
export const memoryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const memoryBefore = process.memoryUsage();

  res.on('finish', () => {
    const memoryAfter = process.memoryUsage();
    const heapDiff = memoryAfter.heapUsed - memoryBefore.heapUsed;

    // Log significant memory increases
    if (heapDiff > 10 * 1024 * 1024) { // > 10MB
      logBusinessEvent('Memory usage spike detected', {
        url: req.originalUrl,
        method: req.method,
        heapIncrease: `${(heapDiff / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryAfter.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryAfter.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        external: `${(memoryAfter.external / 1024 / 1024).toFixed(2)} MB`
      });
    }

    // Log memory warnings
    const heapUsedPercent = (memoryAfter.heapUsed / memoryAfter.heapTotal) * 100;
    if (heapUsedPercent > 90) {
      logBusinessEvent('High memory usage warning', {
        heapUsedPercent: `${heapUsedPercent.toFixed(2)}%`,
        heapUsed: `${(memoryAfter.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryAfter.heapTotal / 1024 / 1024).toFixed(2)} MB`
      });
    }
  });

  next();
};

// Request queue monitoring
interface QueueStats {
  activeRequests: number;
  totalRequests: number;
  avgResponseTime: number;
  maxResponseTime: number;
}

const queueStats: QueueStats = {
  activeRequests: 0,
  totalRequests: 0,
  avgResponseTime: 0,
  maxResponseTime: 0
};

export const requestQueueMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  queueStats.activeRequests++;
  queueStats.totalRequests++;

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    queueStats.activeRequests--;

    // Update average response time
    queueStats.avgResponseTime = (queueStats.avgResponseTime + responseTime) / 2;

    // Update max response time
    if (responseTime > queueStats.maxResponseTime) {
      queueStats.maxResponseTime = responseTime;
    }

    // Log queue warnings
    if (queueStats.activeRequests > 100) {
      logBusinessEvent('High request queue detected', {
        activeRequests: queueStats.activeRequests,
        totalRequests: queueStats.totalRequests,
        avgResponseTime: `${queueStats.avgResponseTime.toFixed(2)}ms`,
        maxResponseTime: `${queueStats.maxResponseTime}ms`
      });
    }
  });

  // Add queue stats to response headers
  res.setHeader('X-Queue-Active', queueStats.activeRequests.toString());
  res.setHeader('X-Queue-Total', queueStats.totalRequests.toString());

  next();
};

// Get current performance stats
export const getPerformanceStats = () => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    memory: {
      heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memUsage.external / 1024 / 1024).toFixed(2)} MB`,
      rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsedPercent: `${((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2)}%`
    },
    cpu: {
      user: `${(cpuUsage.user / 1000).toFixed(2)}ms`,
      system: `${(cpuUsage.system / 1000).toFixed(2)}ms`
    },
    queue: { ...queueStats },
    uptime: `${(process.uptime() / 60).toFixed(2)} minutes`,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  };
};

// Performance endpoint handler
export const performanceHandler = (req: Request, res: Response) => {
  const stats = getPerformanceStats();

  res.json({
    success: true,
    message: 'Performance statistics retrieved',
    data: stats,
    timestamp: new Date().toISOString()
  });
};

export default {
  responseTimeTracker,
  smartCompression,
  requestSizeLimiter,
  bandwidthMonitor,
  cpuMonitor,
  memoryMonitor,
  requestQueueMonitor,
  getPerformanceStats,
  performanceHandler
};