import { Router, Request, Response } from 'express';
import { healthService } from '../services/healthService';
import { performanceHandler } from '../middleware/performance';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Basic health check endpoint
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const health = await healthService.getHealth();

  const statusCode = health.status === 'healthy' ? 200 :
                   health.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json({
    success: health.status !== 'unhealthy',
    message: `System is ${health.status}`,
    data: health,
  });
}));

// Detailed health check endpoint
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  const health = await healthService.getHealth();

  const statusCode = health.status === 'healthy' ? 200 :
                   health.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json({
    success: health.status !== 'unhealthy',
    message: `Detailed system health report`,
    data: health,
    timestamp: new Date().toISOString(),
  });
}));

// Kubernetes readiness probe
router.get('/ready', asyncHandler(async (req: Request, res: Response) => {
  const readiness = await healthService.getReadiness();

  res.status(readiness.ready ? 200 : 503).json({
    ready: readiness.ready,
    message: readiness.message,
    timestamp: new Date().toISOString(),
  });
}));

// Kubernetes liveness probe
router.get('/live', (req: Request, res: Response) => {
  const liveness = healthService.getLiveness();

  res.status(liveness.alive ? 200 : 503).json({
    alive: liveness.alive,
    message: liveness.message,
    timestamp: new Date().toISOString(),
  });
});

// Performance metrics endpoint
router.get('/performance', performanceHandler);

// Service status endpoints
router.get('/database', asyncHandler(async (req: Request, res: Response) => {
  const health = await healthService.getHealth();
  const dbHealth = health.services.database;

  res.status(dbHealth.status === 'healthy' ? 200 : 503).json({
    success: dbHealth.status !== 'unhealthy',
    message: 'Database health status',
    data: dbHealth,
    timestamp: new Date().toISOString(),
  });
}));

router.get('/cache', asyncHandler(async (req: Request, res: Response) => {
  const health = await healthService.getHealth();
  const cacheHealth = health.services.cache;

  res.status(cacheHealth.status === 'healthy' ? 200 : 503).json({
    success: cacheHealth.status !== 'unhealthy',
    message: 'Cache health status',
    data: cacheHealth,
    timestamp: new Date().toISOString(),
  });
}));

router.get('/memory', asyncHandler(async (req: Request, res: Response) => {
  const health = await healthService.getHealth();
  const memoryHealth = health.services.memory;

  res.json({
    success: memoryHealth.status !== 'unhealthy',
    message: 'Memory health status',
    data: {
      ...memoryHealth,
      metrics: health.metrics.memoryUsage,
    },
    timestamp: new Date().toISOString(),
  });
}));

// Simple ping endpoint
router.get('/ping', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Version endpoint
router.get('/version', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Version information',
    data: {
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;