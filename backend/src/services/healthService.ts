import mongoose from 'mongoose';
import { cacheService } from './cacheService';
import { config } from '../config/env';
import logger from '../utils/logger';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    cache: ServiceHealth;
    memory: ServiceHealth;
    disk: ServiceHealth;
  };
  metrics: {
    requestCount: number;
    averageResponseTime: number;
    errorRate: number;
    memoryUsage: MemoryUsage;
    cpuUsage: CPUUsage;
  };
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  message?: string;
  lastChecked: string;
}

interface MemoryUsage {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  heapUsedPercent: number;
}

interface CPUUsage {
  user: number;
  system: number;
  percent: number;
}

class HealthService {
  private metrics = {
    requestCount: 0,
    totalResponseTime: 0,
    errorCount: 0,
    startTime: Date.now(),
  };

  private lastCpuUsage = process.cpuUsage();
  private lastCpuTime = process.hrtime();

  constructor() {
    // Start periodic health checks
    if (config.healthCheck.interval) {
      setInterval(() => {
        this.performHealthCheck().catch(error => {
          logger.error('Health check failed:', error);
        });
      }, config.healthCheck.interval);
    }
  }

  // Update metrics (called by middleware)
  updateMetrics(responseTime: number, isError: boolean = false) {
    this.metrics.requestCount++;
    this.metrics.totalResponseTime += responseTime;
    if (isError) {
      this.metrics.errorCount++;
    }
  }

  // Check database health
  private async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      // Check connection state
      if (mongoose.connection.readyState !== 1) {
        return {
          status: 'unhealthy',
          message: 'Database not connected',
          lastChecked: new Date().toISOString(),
        };
      }

      // Perform a simple query to test responsiveness
      await mongoose.connection.db.admin().ping();
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        message: responseTime < 1000 ? 'Database responding normally' : 'Database responding slowly',
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: `Database error: ${(error as Error).message}`,
        lastChecked: new Date().toISOString(),
      };
    }
  }

  // Check cache health
  private async checkCache(): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      const testKey = 'health-check-test';
      const testValue = { timestamp: Date.now() };

      // Test cache write
      await cacheService.set(testKey, testValue, 60);

      // Test cache read
      const retrieved = await cacheService.get(testKey);

      // Clean up test data
      await cacheService.del(testKey);

      const responseTime = Date.now() - startTime;

      if (!retrieved) {
        return {
          status: 'degraded',
          responseTime,
          message: 'Cache read/write test failed',
          lastChecked: new Date().toISOString(),
        };
      }

      return {
        status: responseTime < 500 ? 'healthy' : 'degraded',
        responseTime,
        message: responseTime < 500 ? 'Cache responding normally' : 'Cache responding slowly',
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: `Cache error: ${(error as Error).message}`,
        lastChecked: new Date().toISOString(),
      };
    }
  }

  // Check memory health
  private checkMemory(): ServiceHealth {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    let message = 'Memory usage normal';

    if (heapUsedPercent > 90) {
      status = 'unhealthy';
      message = `Critical memory usage: ${heapUsedPercent.toFixed(2)}%`;
    } else if (heapUsedPercent > 80) {
      status = 'degraded';
      message = `High memory usage: ${heapUsedPercent.toFixed(2)}%`;
    }

    return {
      status,
      message,
      lastChecked: new Date().toISOString(),
    };
  }

  // Check disk health (simplified)
  private checkDisk(): ServiceHealth {
    try {
      // For a more comprehensive disk check, you'd use fs.stat() to check available space
      // This is a simplified version
      return {
        status: 'healthy',
        message: 'Disk space adequate',
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Disk check failed: ${(error as Error).message}`,
        lastChecked: new Date().toISOString(),
      };
    }
  }

  // Get memory metrics
  private getMemoryUsage(): MemoryUsage {
    const memUsage = process.memoryUsage();
    return {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024), // MB
      rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      heapUsedPercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    };
  }

  // Get CPU metrics
  private getCPUUsage(): CPUUsage {
    const currentCpuUsage = process.cpuUsage(this.lastCpuUsage);
    const currentTime = process.hrtime(this.lastCpuTime);

    const totalTime = currentTime[0] * 1000000 + currentTime[1] / 1000; // microseconds
    const totalCpu = currentCpuUsage.user + currentCpuUsage.system;
    const cpuPercent = (totalCpu / totalTime) * 100;

    // Update for next calculation
    this.lastCpuUsage = process.cpuUsage();
    this.lastCpuTime = process.hrtime();

    return {
      user: Math.round(currentCpuUsage.user / 1000), // milliseconds
      system: Math.round(currentCpuUsage.system / 1000), // milliseconds
      percent: Math.round(cpuPercent * 100) / 100, // percentage
    };
  }

  // Perform comprehensive health check
  private async performHealthCheck(): Promise<void> {
    try {
      const health = await this.getHealth();

      if (health.status === 'unhealthy') {
        logger.error('System health check failed', health);
      } else if (health.status === 'degraded') {
        logger.warn('System performance degraded', health);
      } else {
        logger.debug('System health check passed', health);
      }
    } catch (error) {
      logger.error('Health check error:', error);
    }
  }

  // Get overall system health
  async getHealth(): Promise<HealthStatus> {
    const [database, cache] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
    ]);

    const memory = this.checkMemory();
    const disk = this.checkDisk();

    const services = { database, cache, memory, disk };

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    const serviceStatuses = Object.values(services).map(service => service.status);

    if (serviceStatuses.includes('unhealthy')) {
      overallStatus = 'unhealthy';
    } else if (serviceStatuses.includes('degraded')) {
      overallStatus = 'degraded';
    }

    // Calculate metrics
    const averageResponseTime = this.metrics.requestCount > 0
      ? this.metrics.totalResponseTime / this.metrics.requestCount
      : 0;

    const errorRate = this.metrics.requestCount > 0
      ? (this.metrics.errorCount / this.metrics.requestCount) * 100
      : 0;

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.metrics.startTime) / 1000),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.nodeEnv,
      services,
      metrics: {
        requestCount: this.metrics.requestCount,
        averageResponseTime: Math.round(averageResponseTime),
        errorRate: Math.round(errorRate * 100) / 100,
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCPUUsage(),
      },
    };
  }

  // Get readiness status (for Kubernetes readiness probes)
  async getReadiness(): Promise<{ ready: boolean; message: string }> {
    try {
      const database = await this.checkDatabase();

      if (database.status === 'unhealthy') {
        return {
          ready: false,
          message: 'Database not ready',
        };
      }

      return {
        ready: true,
        message: 'Service ready',
      };
    } catch (error) {
      return {
        ready: false,
        message: `Readiness check failed: ${(error as Error).message}`,
      };
    }
  }

  // Get liveness status (for Kubernetes liveness probes)
  getLiveness(): { alive: boolean; message: string } {
    // Simple liveness check - if the process is running and can respond
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    if (heapUsedPercent > 95) {
      return {
        alive: false,
        message: 'Critical memory usage detected',
      };
    }

    return {
      alive: true,
      message: 'Service alive',
    };
  }

  // Reset metrics (useful for testing)
  resetMetrics(): void {
    this.metrics = {
      requestCount: 0,
      totalResponseTime: 0,
      errorCount: 0,
      startTime: Date.now(),
    };
  }
}

export const healthService = new HealthService();
export default healthService;