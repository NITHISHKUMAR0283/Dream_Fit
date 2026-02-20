const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to DreamFit API',
    version: '1.0.0',
    environment: 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mock product routes
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    message: 'Products retrieved successfully',
    data: {
      products: [
        {
          _id: '1',
          name: 'Elegant Summer Dress',
          description: 'Beautiful floral summer dress perfect for any occasion',
          price: 2999.99,
          discountPrice: 2499.99,
          category: 'Summer Dresses',
          sizes: ['S', 'M', 'L'],
          colors: ['Red', 'Blue', 'Green'],
          images: ['https://via.placeholder.com/300x400?text=Dress+1'],
          stockQuantity: 50,
          inStock: true,
          featured: true
        },
        {
          _id: '2',
          name: 'Classic Evening Gown',
          description: 'Sophisticated evening gown for special occasions',
          price: 4999.99,
          category: 'Evening Wear',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Black', 'Navy', 'Burgundy'],
          images: ['https://via.placeholder.com/300x400?text=Dress+2'],
          stockQuantity: 25,
          inStock: true,
          featured: false
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 2,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  });
});

app.get('/api/products/featured', (req, res) => {
  res.json({
    success: true,
    message: 'Featured products retrieved successfully',
    data: {
      products: [
        {
          _id: '1',
          name: 'Elegant Summer Dress',
          description: 'Beautiful floral summer dress perfect for any occasion',
          price: 2999.99,
          discountPrice: 2499.99,
          category: 'Summer Dresses',
          sizes: ['S', 'M', 'L'],
          colors: ['Red', 'Blue', 'Green'],
          images: ['https://via.placeholder.com/300x400?text=Dress+1'],
          stockQuantity: 50,
          inStock: true,
          featured: true
        }
      ]
    }
  });
});

app.get('/api/products/categories', (req, res) => {
  res.json({
    success: true,
    message: 'Categories retrieved successfully',
    data: {
      categories: ['Summer Dresses', 'Evening Wear', 'Casual Wear', 'Party Dresses']
    }
  });
});

// Mock auth routes
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: 'demo-user-id',
        name: req.body.name || 'Demo User',
        email: req.body.email || 'demo@example.com',
        role: 'user'
      },
      token: 'demo-jwt-token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: 'demo-user-id',
        name: 'Demo User',
        email: req.body.email || 'demo@example.com',
        role: 'user'
      },
      token: 'demo-jwt-token'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 DreamFit Simple API Server Started
📡 Port: ${PORT}
🌍 Environment: development
🔗 API: http://localhost:${PORT}/api
📚 Health: http://localhost:${PORT}/api/health
  `);
});

module.exports = app;