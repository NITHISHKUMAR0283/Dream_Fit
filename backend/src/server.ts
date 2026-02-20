import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config } from './config/env';
import connectDB from './config/database';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import uploadRoutes from './routes/upload';
import healthRoutes from './routes/health';
import docsRoutes from './routes/docs';
import favoritesRoutes from './routes/favorites';
import cartRoutes from './routes/cart';
import aboutContentRoutes from './routes/aboutContent';

const app = express();
const PORT = config.port;

// Connect to MongoDB
connectDB();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Compression middleware
app.use(compression());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: config.isProduction
    ? [config.cors.frontendUrl]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID']
};
app.use(cors(corsOptions));

// Logging middleware
if (config.isDevelopment) {
  const morgan = require('morgan');
  app.use(morgan('dev'));
} else {
  const morgan = require('morgan');
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: config.upload.maxFileSize + 'b' }));
app.use(express.urlencoded({ extended: true, limit: config.upload.maxFileSize + 'b' }));

// Documentation routes (before rate limiting)
app.use('/api/docs', docsRoutes);

// Health check routes
app.use('/api/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/about-content', aboutContentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to DreamFit API',
    version: config.nodeEnv === 'production' ? '1.0.0' : 'development',
    environment: config.nodeEnv,
    documentation: '/api/docs',
    health: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// 404 handler - catch all unmatched routes
app.use((req, res, next) => {
  notFoundHandler(req, res);
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }

    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 30000);
};

// Start server
const server = app.listen(PORT, () => {
  logger.info(`
🚀 DreamFit API Server Started
📡 Port: ${PORT}
🌍 Environment: ${config.nodeEnv}
🗄️  Database: Supabase
🔗 API: http://localhost:${PORT}/api
📚 Health: http://localhost:${PORT}/api/health
📊 Performance: http://localhost:${PORT}/api/health/performance
🔍 Version: http://localhost:${PORT}/api/health/version
  `);

  // Log configuration in development
  if (config.isDevelopment) {
    logger.debug('Configuration:', {
      port: PORT,
      environment: config.nodeEnv,
      database: '✅ MongoDB',
      cache: config.redis.url ? '✅ Redis' : '📦 Memory',
      rateLimit: config.rateLimit,
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle graceful shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;