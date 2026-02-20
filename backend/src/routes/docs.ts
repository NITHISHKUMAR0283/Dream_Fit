import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';
import { config } from '../config/env';

const router = Router();
const swagger = swaggerSpec as any;

// Swagger UI options
const swaggerOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2563eb }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
  `,
  customSiteTitle: 'DreamFit API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
    requestInterceptor: (req: any) => {
      // Add request ID to all API calls from Swagger UI
      req.headers['X-Request-ID'] = `swagger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return req;
    }
  }
};

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swagger, swaggerOptions));

// Serve raw OpenAPI spec as JSON
router.get('/json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swagger);
});

// Serve OpenAPI spec as YAML
router.get('/yaml', (req: Request, res: Response) => {
  try {
    const yaml = require('js-yaml');
    res.setHeader('Content-Type', 'application/x-yaml');
    res.send(yaml.dump(swagger));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'YAML export not available - js-yaml dependency missing',
      timestamp: new Date().toISOString()
    });
  }
});

// API documentation metadata
router.get('/info', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API documentation information',
    data: {
      title: swagger.info.title,
      version: swagger.info.version,
      description: swagger.info.description,
      contact: swagger.info.contact,
      license: swagger.info.license,
      servers: swagger.servers,
      endpoints: {
        documentation: '/api/docs',
        openapi_json: '/api/docs/json',
        openapi_yaml: '/api/docs/yaml',
        postman_collection: '/api/docs/postman'
      },
      tags: swagger.tags?.map((tag: any) => ({
        name: tag.name,
        description: tag.description
      })),
      environment: config.nodeEnv,
      timestamp: new Date().toISOString()
    }
  });
});

// Generate Postman collection
router.get('/postman', (req: Request, res: Response) => {
  const baseUrl = config.isDevelopment ? `http://localhost:${config.port}/api` : '/api';

  const postmanCollection = {
    info: {
      name: 'DreamFit API',
      description: swagger.info.description,
      version: swagger.info.version,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{jwt_token}}',
          type: 'string'
        }
      ]
    },
    variable: [
      {
        key: 'base_url',
        value: baseUrl,
        type: 'string'
      },
      {
        key: 'jwt_token',
        value: '',
        type: 'string'
      }
    ],
    item: [
      {
        name: 'Authentication',
        item: [
          {
            name: 'Register User',
            request: {
              method: 'POST',
              header: [
                {
                  key: 'Content-Type',
                  value: 'application/json'
                }
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  name: 'John Doe',
                  email: 'john@example.com',
                  password: 'Password123!',
                  phone: '9876543210'
                }, null, 2)
              },
              url: {
                raw: '{{base_url}}/auth/register',
                host: ['{{base_url}}'],
                path: ['auth', 'register']
              }
            }
          },
          {
            name: 'Login User',
            request: {
              method: 'POST',
              header: [
                {
                  key: 'Content-Type',
                  value: 'application/json'
                }
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  email: 'john@example.com',
                  password: 'Password123!'
                }, null, 2)
              },
              url: {
                raw: '{{base_url}}/auth/login',
                host: ['{{base_url}}'],
                path: ['auth', 'login']
              }
            }
          }
        ]
      },
      {
        name: 'Products',
        item: [
          {
            name: 'Get All Products',
            request: {
              method: 'GET',
              url: {
                raw: '{{base_url}}/products?page=1&limit=12',
                host: ['{{base_url}}'],
                path: ['products'],
                query: [
                  { key: 'page', value: '1' },
                  { key: 'limit', value: '12' }
                ]
              }
            }
          },
          {
            name: 'Get Product by ID',
            request: {
              method: 'GET',
              url: {
                raw: '{{base_url}}/products/:id',
                host: ['{{base_url}}'],
                path: ['products', ':id'],
                variable: [
                  {
                    key: 'id',
                    value: '64a1234567890abcdef12345'
                  }
                ]
              }
            }
          }
        ]
      },
      {
        name: 'Orders',
        item: [
          {
            name: 'Create Order',
            request: {
              method: 'POST',
              header: [
                {
                  key: 'Content-Type',
                  value: 'application/json'
                },
                {
                  key: 'Authorization',
                  value: 'Bearer {{jwt_token}}'
                }
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  items: [
                    {
                      productId: '64a1234567890abcdef12345',
                      quantity: 2,
                      size: 'M',
                      color: 'Red'
                    }
                  ],
                  shippingAddress: {
                    fullName: 'John Doe',
                    address: '123 Main Street, Apartment 4B',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    phone: '9876543210'
                  },
                  paymentMethod: 'UPI'
                }, null, 2)
              },
              url: {
                raw: '{{base_url}}/orders',
                host: ['{{base_url}}'],
                path: ['orders']
              }
            }
          }
        ]
      },
      {
        name: 'Health',
        item: [
          {
            name: 'Health Check',
            request: {
              method: 'GET',
              url: {
                raw: '{{base_url}}/health',
                host: ['{{base_url}}'],
                path: ['health']
              }
            }
          }
        ]
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="DreamFit-API.postman_collection.json"');
  res.json(postmanCollection);
});

export default router;