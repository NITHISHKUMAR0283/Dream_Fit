const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize Supabase Admin Client (for bypassing RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Helper function to transform product data from database format (snake_case) to frontend format (camelCase)
const transformProductForFrontend = (product) => {
  if (!product) return null;

  // Fix image URLs
  const fixedImages = product.images?.map(img => {
    if (img === '/api/placeholder/400/600') {
      return 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&q=80';
    }
    if (img && img.startsWith('data:image/')) {
      return 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop&q=80';
    }
    return img;
  }) || [];

  return {
    _id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    discountPrice: product.discount_price,
    images: fixedImages,
    category: product.category,
    sizes: product.sizes,
    colors: product.colors,
    inStock: product.in_stock,
    stockQuantity: product.stock_quantity,
    featured: product.featured,
    rating: product.rating,
    numReviews: product.num_reviews,
    tags: product.tags,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

// Image upload endpoint
app.post('/api/upload/image', async (req, res) => {
  try {
    const { image, folder = 'dreamfit/products' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        { width: 800, height: 1200, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height
      },
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Bulk image upload endpoint
app.post('/api/upload/images', async (req, res) => {
  try {
    const { images, folder = 'dreamfit/products' } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: 'No images array provided'
      });
    }

    // Upload all images to Cloudinary
    const uploadPromises = images.map(image =>
      cloudinary.uploader.upload(image, {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 800, height: 1200, crop: 'fill' },
          { quality: 'auto' }
        ]
      })
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    }));

    res.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} images uploaded successfully`
    });

  } catch (error) {
    console.error('Bulk image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// Placeholder image endpoint for missing product images
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;

  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${width}x${height}
      </text>
      <rect x="20%" y="20%" width="60%" height="60%" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="5,5"/>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.send(svg);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to DreamFit API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const { limit } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform products from database format to frontend format
    const products = (data || []).map(transformProductForFrontend);

    res.json({
      success: true,
      data: {
        products: products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;

    // Transform products from database format to frontend format
    const products = (data || []).map(transformProductForFrontend);

    res.json({
      success: true,
      data: {
        products: products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Transform product from database format to frontend format
    const product = transformProductForFrontend(data);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error: error.message
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const productData = { ...req.body };
    console.log('=== PRODUCT CREATION DEBUG ===');
    console.log('Original productData:', JSON.stringify(productData, null, 2));

    // Handle image uploads if present
    if (productData.images && Array.isArray(productData.images)) {
      const cloudinaryImages = [];

      for (const image of productData.images) {
        // If image is base64 or needs to be uploaded to Cloudinary
        if (image && (image.startsWith('data:image/') || image.startsWith('blob:'))) {
          try {
            const result = await cloudinary.uploader.upload(image, {
              folder: 'dreamfit/products',
              resource_type: 'image',
              quality: 'auto',
              fetch_format: 'auto',
              transformation: [
                { width: 800, height: 1200, crop: 'fill' },
                { quality: 'auto' }
              ]
            });
            cloudinaryImages.push(result.secure_url);
          } catch (uploadError) {
            console.error('Error uploading image to Cloudinary:', uploadError);
            // If upload fails, use a fallback image
            cloudinaryImages.push('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&q=80');
          }
        } else if (image && image.startsWith('http')) {
          // If it's already a URL, keep it
          cloudinaryImages.push(image);
        } else {
          // Fallback for invalid images
          cloudinaryImages.push('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&q=80');
        }
      }

      productData.images = cloudinaryImages;
    }

    // Map camelCase fields from frontend to snake_case fields for database
    const fieldMapping = {
      'discountPrice': 'discount_price',
      'inStock': 'in_stock',
      'stockQuantity': 'stock_quantity',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };

    Object.keys(fieldMapping).forEach(camelField => {
      const snakeField = fieldMapping[camelField];
      if (productData[camelField] !== undefined) {
        console.log(`Mapping ${camelField} -> ${snakeField}:`, productData[camelField]);
        productData[snakeField] = productData[camelField];
        delete productData[camelField];
      }
    });

    console.log('Final productData after field mapping:', JSON.stringify(productData, null, 2));

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Update product endpoint
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    console.log('Updating product:', id);
    console.log('Update data received:', updateData);

    // First check if product exists
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle image uploads if present
    if (updateData.images && Array.isArray(updateData.images)) {
      const cloudinaryImages = [];

      for (const image of updateData.images) {
        // If image is base64 or needs to be uploaded to Cloudinary
        if (image && (image.startsWith('data:image/') || image.startsWith('blob:'))) {
          try {
            const result = await cloudinary.uploader.upload(image, {
              folder: 'dreamfit/products',
              resource_type: 'image',
              quality: 'auto',
              fetch_format: 'auto',
              transformation: [
                { width: 800, height: 1200, crop: 'fill' },
                { quality: 'auto' }
              ]
            });
            cloudinaryImages.push(result.secure_url);
          } catch (uploadError) {
            console.error('Error uploading image to Cloudinary:', uploadError);
            // If upload fails, use a fallback image
            cloudinaryImages.push('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&q=80');
          }
        } else if (image && image.startsWith('http')) {
          // If it's already a URL, keep it
          cloudinaryImages.push(image);
        } else {
          // Fallback for invalid images
          cloudinaryImages.push('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&q=80');
        }
      }

      updateData.images = cloudinaryImages;
    }

    // Map camelCase fields from frontend to snake_case fields for database
    const fieldMapping = {
      'discountPrice': 'discount_price',
      'inStock': 'in_stock',
      'stockQuantity': 'stock_quantity',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };

    Object.keys(fieldMapping).forEach(camelField => {
      const snakeField = fieldMapping[camelField];
      if (updateData[camelField] !== undefined) {
        updateData[snakeField] = updateData[camelField];
        delete updateData[camelField];
      }
    });

    console.log('Final update data (after field mapping):', updateData);

    // Update the product
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    console.log('Product updated successfully:', data?.[0]);

    res.json({
      success: true,
      data: data?.[0] || null,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product endpoint
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First check if product exists
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete the product
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(400).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Fix product images endpoint
app.post('/api/products/fix-images', async (req, res) => {
  try {
    // Update the featured dress product
    const { error: error1 } = await supabase
      .from('products')
      .update({
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop'],
        name: 'Elegant Floral Summer Dress',
        description: 'Beautiful floral print dress perfect for summer occasions'
      })
      .eq('id', '29f83a63-3e57-43ff-a76c-7f427abab454');

    // Update the other product
    const { error: error2 } = await supabase
      .from('products')
      .update({
        images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop'],
        name: 'Casual Cotton T-Shirt',
        description: 'Comfortable and stylish cotton t-shirt for everyday wear'
      })
      .eq('id', 'eb45260c-53f8-4dde-a268-0948b2ecc80e');

    if (error1) throw error1;
    if (error2) throw error2;

    res.json({
      success: true,
      message: 'Product images updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product images',
      error: error.message
    });
  }
});

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          isAdmin: false
        }
      }
    });

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Track user login in database
async function trackUserLogin(userId, email, name, loginMethod = 'google', req) {
  try {
    const { error } = await supabase
      .from('user_login_history')
      .insert({
        user_id: userId,
        user_email: email,
        user_name: name,
        login_method: loginMethod,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('user-agent'),
        login_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking login:', error);
    }
  } catch (error) {
    console.error('Error in trackUserLogin:', error);
  }
}

// Google OAuth endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, isAdmin } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential'
      });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Required user information not available from Google'
      });
    }

    // Define admin email - only this email gets admin access
    const ADMIN_EMAIL = 'nk0283@srmist.edu.in';
    const userIsAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // Create a mock user object for authentication
    // Since Supabase auth handles user management, we'll create a temporary user object
    const user = {
      id: googleId, // Use Google ID as user ID
      email: email.toLowerCase(),
      name: name,
      is_admin: userIsAdmin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Track login in database
    await trackUserLogin(user.id, user.email, user.name, 'google', req);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Return user data in frontend-compatible format
    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: picture, // Use picture from Google payload
        isAdmin: user.is_admin,
        isVerified: true,
        wishlist: [],
        addresses: [],
        createdAt: user.created_at
      },
      token: token
    });
  } catch (error) {
    console.error('Google auth error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      requestBody: req.body
    });
    return res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Authentication failed'
    });
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Get user profile endpoint
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    // Return user data from token (since we're using JWT, user data is in the token)
    const userProfile = {
      id: req.user.userId,
      name: req.user.name || 'User',
      email: req.user.email,
      isAdmin: req.user.isAdmin || false,
      wishlist: [],
      addresses: [],
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        user: userProfile
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// User wishlist endpoints
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          price,
          discount_price,
          images,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Product ID are required'
      });
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({ user_id, product_id })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
});

app.delete('/api/favorites/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
});

// Cart endpoints
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        size,
        color,
        created_at,
        products (
          id,
          name,
          price,
          discount_price,
          images,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate total
    let total = 0;
    const items = data?.map(item => {
      const price = item.products.discount_price || item.products.price;
      const itemTotal = price * item.quantity;
      total += itemTotal;
      return {
        ...item,
        itemTotal
      };
    }) || [];

    res.json({
      success: true,
      data: {
        items,
        total,
        count: items.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { user_id, product_id, quantity, size, color } = req.body;

    if (!user_id || !product_id || !quantity || !size || !color) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: user_id, product_id, quantity, size, color'
      });
    }

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('size', size)
      .eq('color', color)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({
          quantity: existing[0].quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing[0].id)
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        message: 'Cart updated',
        data
      });
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id, product_id, quantity, size, color })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
});

app.put('/api/cart/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', cartItemId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Cart item updated',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
});

app.delete('/api/cart/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
});

// Orders endpoints

// Get all orders (for admin dashboard)
app.get('/api/orders/all', async (req, res) => {
  try {
    const { data, error} = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Update order status (for admin)
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// My orders endpoint with pagination (for authenticated users) - MUST come before /:userId
app.get('/api/orders/my-orders', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // For now, return empty orders array since we don't have authentication middleware
    // In a real app, you'd extract user ID from the JWT token
    res.json({
      success: true,
      data: {
        orders: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      },
      message: 'Orders fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      user_id,
      items,
      total_amount,
      shipping_address,
      payment_method,
      shipping_cost = 0,
      tax = 0
    } = req.body;

    if (!user_id || !items || !total_amount || !shipping_address || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate subtotal from items
    let calculated_subtotal = 0;
    items.forEach(item => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      calculated_subtotal += price * quantity;
    });

    // Validate total amount
    const calculated_total = calculated_subtotal + shipping_cost + tax;

    // Allow 1 rupee difference for rounding
    if (Math.abs(calculated_total - total_amount) > 1) {
      return res.status(400).json({
        success: false,
        message: 'Total amount mismatch. Please refresh and try again.',
        details: {
          calculated: calculated_total,
          received: total_amount,
          subtotal: calculated_subtotal,
          shipping: shipping_cost,
          tax: tax
        }
      });
    }

    // Generate order number
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const orderNumber = `ORD-${String((count || 0) + 1).padStart(6, '0')}`;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id,
        order_number: orderNumber,
        items,
        subtotal: calculated_subtotal,
        shipping_cost,
        tax,
        total_amount: calculated_total,
        status: 'pending',
        shipping_address,
        payment_method
      })
      .select()
      .single();

    if (error) throw error;

    // Clear user's cart after successful order
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed'
      });
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email,
        phone: phone || null,
        subscribed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Newsletter subscription error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to subscribe',
        error: error.message
      });
    }

    res.json({
      success: true,
      data,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: error.message
    });
  }
});

// Category endpoints
app.post('/api/categories', async (req, res) => {
  try {
    const { name, description, image, showOnHome, homeOrder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name,
        description: description || '',
        image: image || '',
        show_on_home: showOnHome || false,
        home_order: homeOrder || 0,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Category creation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message
      });
    }

    res.json({
      success: true,
      data,
      message: 'Category created successfully'
    });

  } catch (error) {
    console.error('Category creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, showOnHome, homeOrder } = req.body;

    const { data, error } = await supabase
      .from('categories')
      .update({
        name,
        description,
        image,
        show_on_home: showOnHome,
        home_order: homeOrder,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Category update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error.message
      });
    }

    res.json({
      success: true,
      data,
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Category deletion error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

// Hero Images Endpoints

// Get active hero image
app.get('/api/hero-images/active', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

    res.json({
      success: true,
      data: data || null
    });
  } catch (error) {
    console.error('Error fetching hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero image',
      error: error.message
    });
  }
});

// Get all hero images (for admin)
app.get('/api/hero-images', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching hero images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero images',
      error: error.message
    });
  }
});

// Upload hero image
app.post('/api/hero-images', async (req, res) => {
  try {
    const { image, title, subtitle, position = 'main' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    let imageUrl = image;

    // Upload to Cloudinary if it's a base64 image
    if (image.startsWith('data:image/')) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'dreamfit/hero',
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          transformation: [
            { width: 1200, height: 1400, crop: 'fill' },
            { quality: 'auto' }
          ]
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading image',
          error: uploadError.message
        });
      }
    }

    // Deactivate all existing hero images for this position
    await supabase
      .from('hero_images')
      .update({ is_active: false })
      .eq('position', position);

    // Insert new hero image
    const { data, error } = await supabase
      .from('hero_images')
      .insert({
        image_url: imageUrl,
        title: title || '',
        subtitle: subtitle || '',
        position,
        is_active: true,
        display_order: 1
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Hero image uploaded successfully'
    });
  } catch (error) {
    console.error('Error creating hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hero image',
      error: error.message
    });
  }
});

// Update hero image
app.put('/api/hero-images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, subtitle, is_active } = req.body;

    const updateData = {};

    if (image) {
      let imageUrl = image;

      // Upload to Cloudinary if it's a base64 image
      if (image.startsWith('data:image/')) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'dreamfit/hero',
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          transformation: [
            { width: 1200, height: 1400, crop: 'fill' },
            { quality: 'auto' }
          ]
        });
        imageUrl = result.secure_url;
      }

      updateData.image_url = imageUrl;
    }

    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('hero_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: 'Hero image updated successfully'
    });
  } catch (error) {
    console.error('Error updating hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hero image',
      error: error.message
    });
  }
});

// Delete hero image
app.delete('/api/hero-images/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('hero_images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Hero image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hero image',
      error: error.message
    });
  }
});

// Admin Analytics Endpoints

// Get dashboard statistics
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('get_admin_dashboard_stats');

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// Get all users with activity
app.get('/api/admin/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_user_activity')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get user login history
app.get('/api/admin/login-history', async (req, res) => {
  try {
    const { limit = 100, userId } = req.query;

    let query = supabase
      .from('user_login_history')
      .select('*')
      .order('login_at', { ascending: false })
      .limit(parseInt(limit));

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching login history',
      error: error.message
    });
  }
});

// Get daily login statistics
app.get('/api/admin/daily-login-stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const { data, error } = await supabase
      .from('admin_daily_login_stats')
      .select('*')
      .limit(parseInt(days));

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching daily login stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily login statistics',
      error: error.message
    });
  }
});

// Get user count
app.get('/api/admin/user-count', async (req, res) => {
  try {
    const { count: userCount } = await supabase
      .from('user_profiles')
      .select('user_id', { count: 'exact', head: true });

    const { count: loginCount } = await supabase
      .from('user_login_history')
      .select('user_id', { count: 'exact', head: true });

    res.json({
      success: true,
      data: {
        total_registered_users: userCount || 0,
        total_logins_ever: loginCount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user count',
      error: error.message
    });
  }
});

// Testimonials endpoints
app.get('/api/testimonials', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, image, rating, text, displayOrder } = req.body;

    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: 'Name and text are required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([{
        name,
        role: role || '',
        image: image || '',
        rating: rating || 5,
        text,
        display_order: displayOrder || 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, image, rating, text, displayOrder } = req.body;

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update({
        name,
        role,
        image,
        rating,
        text,
        display_order: displayOrder
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(400).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
});

// Site stats endpoints
app.get('/api/site-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching site stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching site stats',
      error: error.message
    });
  }
});

app.put('/api/site-stats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value, label } = req.body;

    const { data, error } = await supabaseAdmin
      .from('site_stats')
      .update({
        value,
        label
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: 'Site stat updated successfully'
    });
  } catch (error) {
    console.error('Error updating site stat:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating site stat',
      error: error.message
    });
  }
});

// Instagram posts endpoints
app.get('/api/instagram-posts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Instagram posts',
      error: error.message
    });
  }
});

app.post('/api/instagram-posts', async (req, res) => {
  try {
    const { image_url, post_url, displayOrder } = req.body;

    if (!image_url) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('instagram_posts')
      .insert([{
        image_url,
        post_url: post_url || '',
        display_order: displayOrder || 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Instagram post added successfully'
    });
  } catch (error) {
    console.error('Error creating Instagram post:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating Instagram post',
      error: error.message
    });
  }
});

app.put('/api/instagram-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, post_url, displayOrder } = req.body;

    const { data, error } = await supabaseAdmin
      .from('instagram_posts')
      .update({
        image_url,
        post_url,
        display_order: displayOrder
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: 'Instagram post updated successfully'
    });
  } catch (error) {
    console.error('Error updating Instagram post:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating Instagram post',
      error: error.message
    });
  }
});

app.delete('/api/instagram-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('instagram_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Instagram post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Instagram post:', error);
    res.status(400).json({
      success: false,
      message: 'Error deleting Instagram post',
      error: error.message
    });
  }
});

// Product tabs (category filters) endpoints
app.get('/api/product-tabs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product_tabs')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching product tabs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product tabs',
      error: error.message
    });
  }
});

app.post('/api/product-tabs', async (req, res) => {
  try {
    const { tab_id, label, displayOrder } = req.body;

    if (!tab_id || !label) {
      return res.status(400).json({
        success: false,
        message: 'Tab ID and label are required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('product_tabs')
      .insert([{
        tab_id,
        label,
        display_order: displayOrder || 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Product tab added successfully'
    });
  } catch (error) {
    console.error('Error creating product tab:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product tab',
      error: error.message
    });
  }
});

app.put('/api/product-tabs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tab_id, label, displayOrder } = req.body;

    const { data, error } = await supabaseAdmin
      .from('product_tabs')
      .update({
        tab_id,
        label,
        display_order: displayOrder
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: 'Product tab updated successfully'
    });
  } catch (error) {
    console.error('Error updating product tab:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product tab',
      error: error.message
    });
  }
});

app.delete('/api/product-tabs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('product_tabs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Product tab deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product tab:', error);
    res.status(400).json({
      success: false,
      message: 'Error deleting product tab',
      error: error.message
    });
  }
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 DreamFit API Server Started
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🗄️  Database: Supabase
🔗 API: http://localhost:${PORT}/api
📚 Health: http://localhost:${PORT}/api/health
🔐 Google OAuth: Enabled
  `);
});