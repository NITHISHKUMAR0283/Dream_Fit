import joi from 'joi';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define validation schema for environment variables
const envSchema = joi.object({
  NODE_ENV: joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: joi.number()
    .port()
    .default(5000),

  // Database - Supabase
  SUPABASE_URL: joi.string()
    .uri()
    .required()
    .messages({
      'any.required': 'SUPABASE_URL is required',
      'string.uri': 'SUPABASE_URL must be a valid URI'
    }),

  SUPABASE_ANON_KEY: joi.string()
    .required()
    .messages({
      'any.required': 'SUPABASE_ANON_KEY is required'
    }),

  SUPABASE_SERVICE_KEY: joi.string()
    .optional(),

  // MongoDB (optional - disabled)
  MONGODB_URI: joi.string()
    .uri()
    .optional(),

  // JWT
  JWT_SECRET: joi.string()
    .min(32)
    .required()
    .messages({
      'any.required': 'JWT_SECRET is required',
      'string.min': 'JWT_SECRET must be at least 32 characters long'
    }),

  JWT_EXPIRE: joi.string()
    .default('7d'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: joi.string()
    .required()
    .messages({
      'any.required': 'CLOUDINARY_CLOUD_NAME is required'
    }),

  CLOUDINARY_API_KEY: joi.string()
    .required()
    .messages({
      'any.required': 'CLOUDINARY_API_KEY is required'
    }),

  CLOUDINARY_API_SECRET: joi.string()
    .required()
    .messages({
      'any.required': 'CLOUDINARY_API_SECRET is required'
    }),

  // UPI Configuration
  UPI_ID: joi.string()
    .required()
    .messages({
      'any.required': 'UPI_ID is required for payment processing'
    }),

  UPI_MERCHANT_NAME: joi.string()
    .default('DreamFit Store'),

  // Admin Configuration
  ADMIN_EMAIL: joi.string()
    .email()
    .required()
    .messages({
      'any.required': 'ADMIN_EMAIL is required',
      'string.email': 'ADMIN_EMAIL must be a valid email'
    }),

  ADMIN_PASSWORD: joi.string()
    .min(8)
    .required()
    .messages({
      'any.required': 'ADMIN_PASSWORD is required',
      'string.min': 'ADMIN_PASSWORD must be at least 8 characters long'
    }),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: joi.number()
    .default(15 * 60 * 1000), // 15 minutes

  RATE_LIMIT_MAX_REQUESTS: joi.number()
    .default(100),

  // Slow Down
  SLOW_DOWN_DELAY_AFTER: joi.number()
    .default(5),

  SLOW_DOWN_DELAY_MS: joi.number()
    .default(500),

  // File Upload
  MAX_FILE_SIZE: joi.number()
    .default(10 * 1024 * 1024), // 10MB

  MAX_FILES: joi.number()
    .default(5),

  // CORS
  FRONTEND_URL: joi.string()
    .uri()
    .default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: joi.string()
    .valid('error', 'warn', 'info', 'http', 'debug')
    .default('info'),

  // Health Check
  HEALTH_CHECK_INTERVAL: joi.number()
    .default(30000), // 30 seconds

  // Session
  SESSION_SECRET: joi.string()
    .min(32)
    .default('default-session-secret-change-in-production'),

  // Email Configuration (optional)
  EMAIL_HOST: joi.string()
    .optional(),

  EMAIL_PORT: joi.number()
    .optional(),

  EMAIL_USER: joi.string()
    .email()
    .optional(),

  EMAIL_PASS: joi.string()
    .optional(),

  EMAIL_FROM: joi.string()
    .email()
    .optional(),

  // Redis Configuration (optional for caching)
  REDIS_URL: joi.string()
    .uri()
    .optional(),

  // Sentry Configuration (optional for error tracking)
  SENTRY_DSN: joi.string()
    .uri()
    .optional(),
}).unknown(true); // Allow unknown keys for flexibility

// Validate environment variables
const { error, value: env } = envSchema.validate(process.env);

if (error) {
  console.error('❌ Environment validation failed:');
  error.details.forEach((detail) => {
    console.error(`   ${detail.message}`);
  });
  process.exit(1);
}

// Export validated environment configuration
export const config = {
  // Server
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',

  // Database
  database: {
    uri: env.MONGODB_URI,
  },

  // JWT
  jwt: {
    secret: env.JWT_SECRET,
    expire: env.JWT_EXPIRE,
  },

  // Cloudinary
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },

  // UPI
  upi: {
    id: env.UPI_ID,
    merchantName: env.UPI_MERCHANT_NAME,
  },

  // Admin
  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },

  // Slow Down
  slowDown: {
    delayAfter: env.SLOW_DOWN_DELAY_AFTER,
    delayMs: env.SLOW_DOWN_DELAY_MS,
  },

  // File Upload
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    maxFiles: env.MAX_FILES,
  },

  // CORS
  cors: {
    frontendUrl: env.FRONTEND_URL,
  },

  // Logging
  logging: {
    level: env.LOG_LEVEL,
  },

  // Health Check
  healthCheck: {
    interval: env.HEALTH_CHECK_INTERVAL,
  },

  // Session
  session: {
    secret: env.SESSION_SECRET,
  },

  // Email (optional)
  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    from: env.EMAIL_FROM,
  },

  // Redis (optional)
  redis: {
    url: env.REDIS_URL,
  },

  // Sentry (optional)
  sentry: {
    dsn: env.SENTRY_DSN,
  },
};

export default config;