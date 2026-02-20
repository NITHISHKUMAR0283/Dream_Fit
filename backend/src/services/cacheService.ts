import NodeCache from 'node-cache';
import Redis from 'ioredis';
import { config } from '../config/env';
import logger from '../utils/logger';

interface CacheInterface {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<boolean>;
  del(key: string): Promise<boolean>;
  flush(): Promise<boolean>;
  keys(pattern?: string): Promise<string[]>;
}

class NodeCacheService implements CacheInterface {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 3600, // 1 hour default TTL
      checkperiod: 600, // Check for expired keys every 10 minutes
      useClones: false,
      deleteOnExpire: true,
      enableLegacyCallbacks: false
    });

    this.cache.on('expired', (key, value) => {
      logger.debug(`Cache key expired: ${key}`);
    });

    this.cache.on('del', (key, value) => {
      logger.debug(`Cache key deleted: ${key}`);
    });
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = this.cache.get<T>(key);
      return value || null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      return this.cache.set(key, value, ttl);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      return this.cache.del(key) > 0;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {
      this.cache.flushAll();
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      const allKeys = this.cache.keys();
      if (!pattern) return allKeys;

      const regex = new RegExp(pattern);
      return allKeys.filter(key => regex.test(key));
    } catch (error) {
      logger.error('Cache keys error:', error);
      return [];
    }
  }

  getStats() {
    return this.cache.getStats();
  }
}

class RedisCacheService implements CacheInterface {
  private redis: Redis;
  private isConnected: boolean = false;

  constructor() {
    if (!config.redis.url) {
      throw new Error('Redis URL not configured');
    }

    this.redis = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      retryStrategy: (times) => Math.min(times * 100, 2000)
    });

    this.redis.on('connect', () => {
      logger.info('Connected to Redis');
      this.isConnected = true;
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
      this.isConnected = false;
    });

    this.redis.on('close', () => {
      logger.warn('Redis connection closed');
      this.isConnected = false;
    });
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) {
        await this.redis.connect();
      }

      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.redis.connect();
      }

      const serializedValue = JSON.stringify(value);
      const result = await this.redis.setex(key, ttl, serializedValue);
      return result === 'OK';
    } catch (error) {
      logger.error(`Redis set error for key ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.redis.connect();
      }

      const result = await this.redis.del(key);
      return result > 0;
    } catch (error) {
      logger.error(`Redis delete error for key ${key}:`, error);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.redis.connect();
      }

      const result = await this.redis.flushdb();
      return result === 'OK';
    } catch (error) {
      logger.error('Redis flush error:', error);
      return false;
    }
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    try {
      if (!this.isConnected) {
        await this.redis.connect();
      }

      return await this.redis.keys(pattern);
    } catch (error) {
      logger.error('Redis keys error:', error);
      return [];
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      this.isConnected = false;
    } catch (error) {
      logger.error('Redis disconnect error:', error);
    }
  }
}

// Cache factory
const createCacheService = (): CacheInterface => {
  if (config.redis.url && config.isProduction) {
    try {
      logger.info('Initializing Redis cache service');
      return new RedisCacheService();
    } catch (error) {
      logger.warn('Failed to initialize Redis, falling back to NodeCache:', error);
      return new NodeCacheService();
    }
  } else {
    logger.info('Initializing NodeCache service');
    return new NodeCacheService();
  }
};

// Cache service instance
export const cacheService = createCacheService();

// Cache key generators
export const CacheKeys = {
  product: (id: string) => `product:${id}`,
  products: (query: string) => `products:${query}`,
  featuredProducts: () => 'products:featured',
  categories: () => 'products:categories',
  user: (id: string) => `user:${id}`,
  userOrders: (userId: string) => `user:${userId}:orders`,
  order: (id: string) => `order:${id}`,
  stats: (type: string) => `stats:${type}`,
  session: (sessionId: string) => `session:${sessionId}`,
};

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
  WEEK: 7 * 24 * 60 * 60, // 1 week
};

// High-level cache methods
export const ProductCache = {
  async getProduct(id: string) {
    return await cacheService.get(CacheKeys.product(id));
  },

  async setProduct(id: string, product: any, ttl: number = CacheTTL.MEDIUM) {
    return await cacheService.set(CacheKeys.product(id), product, ttl);
  },

  async deleteProduct(id: string) {
    return await cacheService.del(CacheKeys.product(id));
  },

  async getFeaturedProducts() {
    return await cacheService.get(CacheKeys.featuredProducts());
  },

  async setFeaturedProducts(products: any[], ttl: number = CacheTTL.MEDIUM) {
    return await cacheService.set(CacheKeys.featuredProducts(), products, ttl);
  },

  async getCategories() {
    return await cacheService.get(CacheKeys.categories());
  },

  async setCategories(categories: string[], ttl: number = CacheTTL.LONG) {
    return await cacheService.set(CacheKeys.categories(), categories, ttl);
  },

  async invalidateProductCaches(productId?: string) {
    const keysToDelete = [
      CacheKeys.featuredProducts(),
      CacheKeys.categories(),
    ];

    if (productId) {
      keysToDelete.push(CacheKeys.product(productId));
    }

    // Also clear product list caches
    const productListKeys = await cacheService.keys('products:*');
    keysToDelete.push(...productListKeys);

    const promises = keysToDelete.map(key => cacheService.del(key));
    await Promise.all(promises);
  }
};

export const UserCache = {
  async getUser(id: string) {
    return await cacheService.get(CacheKeys.user(id));
  },

  async setUser(id: string, user: any, ttl: number = CacheTTL.MEDIUM) {
    return await cacheService.set(CacheKeys.user(id), user, ttl);
  },

  async deleteUser(id: string) {
    return await cacheService.del(CacheKeys.user(id));
  },

  async getUserOrders(userId: string) {
    return await cacheService.get(CacheKeys.userOrders(userId));
  },

  async setUserOrders(userId: string, orders: any[], ttl: number = CacheTTL.SHORT) {
    return await cacheService.set(CacheKeys.userOrders(userId), orders, ttl);
  },

  async invalidateUserCache(userId: string) {
    await Promise.all([
      cacheService.del(CacheKeys.user(userId)),
      cacheService.del(CacheKeys.userOrders(userId))
    ]);
  }
};

export const OrderCache = {
  async getOrder(id: string) {
    return await cacheService.get(CacheKeys.order(id));
  },

  async setOrder(id: string, order: any, ttl: number = CacheTTL.SHORT) {
    return await cacheService.set(CacheKeys.order(id), order, ttl);
  },

  async deleteOrder(id: string) {
    return await cacheService.del(CacheKeys.order(id));
  },

  async invalidateOrderCaches(userId?: string) {
    if (userId) {
      await cacheService.del(CacheKeys.userOrders(userId));
    }
  }
};

// Cache middleware for Express
export const cacheMiddleware = (
  keyGenerator: (req: any) => string,
  ttl: number = CacheTTL.MEDIUM
) => {
  return async (req: any, res: any, next: any) => {
    try {
      const cacheKey = keyGenerator(req);
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        logger.debug(`Cache hit for key: ${cacheKey}`);
        return res.json(cachedData);
      }

      logger.debug(`Cache miss for key: ${cacheKey}`);

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(data: any) {
        if (res.statusCode === 200 && data.success) {
          cacheService.set(cacheKey, data, ttl).catch((error) => {
            logger.error(`Failed to cache response for key ${cacheKey}:`, error);
          });
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

export default cacheService;