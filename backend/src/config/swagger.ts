import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DreamFit E-commerce API',
      version: '1.0.0',
      description: 'A comprehensive e-commerce API for dress shop with advanced features including product management, order processing, user authentication, and payment integration.',
      contact: {
        name: 'DreamFit Support',
        email: 'support@dreamfit.com',
        url: 'https://dreamfit.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: config.isDevelopment ? `http://localhost:${config.port}/api` : '/api',
        description: config.isDevelopment ? 'Development server' : 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  value: { type: 'string' }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64a1234567890abcdef12345'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            phone: {
              type: 'string',
              example: '+919876543210'
            },
            isVerified: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64a1234567890abcdef12345'
            },
            name: {
              type: 'string',
              example: 'Elegant Summer Dress'
            },
            description: {
              type: 'string',
              example: 'Beautiful floral summer dress perfect for any occasion'
            },
            price: {
              type: 'number',
              example: 2999.99
            },
            discountPrice: {
              type: 'number',
              example: 2499.99
            },
            category: {
              type: 'string',
              example: 'Summer Dresses'
            },
            sizes: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
              },
              example: ['S', 'M', 'L']
            },
            colors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Red', 'Blue', 'Green']
            },
            images: {
              type: 'array',
              items: { type: 'string', format: 'uri' },
              example: ['https://res.cloudinary.com/demo/image/upload/dress1.jpg']
            },
            stockQuantity: {
              type: 'integer',
              example: 50
            },
            inStock: {
              type: 'boolean',
              example: true
            },
            featured: {
              type: 'boolean',
              example: false
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['summer', 'casual', 'floral']
            },
            ratings: {
              type: 'object',
              properties: {
                average: { type: 'number', example: 4.5 },
                count: { type: 'integer', example: 128 }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64a1234567890abcdef12345'
            },
            orderNumber: {
              type: 'string',
              example: 'ORD-20240101-001'
            },
            user: {
              type: 'string',
              example: '64a1234567890abcdef12345'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'integer' },
                  size: { type: 'string' },
                  color: { type: 'string' },
                  image: { type: 'string' }
                }
              }
            },
            totalAmount: {
              type: 'number',
              example: 4999.98
            },
            shippingAddress: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                address: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                pincode: { type: 'string' },
                phone: { type: 'string' }
              }
            },
            paymentMethod: {
              type: 'string',
              enum: ['UPI', 'COD'],
              example: 'UPI'
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'completed', 'failed', 'refunded'],
              example: 'completed'
            },
            orderStatus: {
              type: 'string',
              enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'confirmed'
            },
            trackingNumber: {
              type: 'string',
              example: 'TRK123456789'
            },
            estimatedDelivery: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'Password123!'
            },
            phone: {
              type: 'string',
              pattern: '^[6-9]\\d{9}$',
              example: '9876543210'
            }
          }
        },
        ProductCreateRequest: {
          type: 'object',
          required: ['name', 'description', 'price', 'category', 'sizes', 'colors', 'images', 'stockQuantity'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Elegant Summer Dress'
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
              example: 'Beautiful floral summer dress perfect for any occasion'
            },
            price: {
              type: 'number',
              minimum: 0.01,
              example: 2999.99
            },
            discountPrice: {
              type: 'number',
              minimum: 0,
              example: 2499.99
            },
            category: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Summer Dresses'
            },
            sizes: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
              },
              minItems: 1,
              example: ['S', 'M', 'L']
            },
            colors: {
              type: 'array',
              items: { type: 'string' },
              minItems: 1,
              example: ['Red', 'Blue', 'Green']
            },
            images: {
              type: 'array',
              items: { type: 'string', format: 'uri' },
              minItems: 1,
              maxItems: 10,
              example: ['https://res.cloudinary.com/demo/image/upload/dress1.jpg']
            },
            stockQuantity: {
              type: 'integer',
              minimum: 0,
              example: 50
            },
            featured: {
              type: 'boolean',
              example: false
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['summer', 'casual', 'floral']
            }
          }
        },
        OrderCreateRequest: {
          type: 'object',
          required: ['items', 'shippingAddress', 'paymentMethod'],
          properties: {
            items: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['productId', 'quantity', 'size', 'color'],
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'integer', minimum: 1, maximum: 10 },
                  size: { type: 'string', enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
                  color: { type: 'string' }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              required: ['fullName', 'address', 'city', 'state', 'pincode', 'phone'],
              properties: {
                fullName: { type: 'string', minLength: 2, maxLength: 100 },
                address: { type: 'string', minLength: 10, maxLength: 200 },
                city: { type: 'string', minLength: 2, maxLength: 50 },
                state: { type: 'string', minLength: 2, maxLength: 50 },
                pincode: { type: 'string', pattern: '^[1-9][0-9]{5}$' },
                phone: { type: 'string', pattern: '^[6-9]\\d{9}$' }
              }
            },
            paymentMethod: {
              type: 'string',
              enum: ['UPI', 'COD']
            },
            notes: {
              type: 'string',
              maxLength: 500
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Products',
        description: 'Product management endpoints'
      },
      {
        name: 'Orders',
        description: 'Order management endpoints'
      },
      {
        name: 'Upload',
        description: 'File upload endpoints'
      },
      {
        name: 'Health',
        description: 'System health and monitoring endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;