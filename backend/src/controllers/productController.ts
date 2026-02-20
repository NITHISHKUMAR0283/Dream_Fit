import { Request, Response } from 'express';
import Product from '../models/Product';
import { AuthRequest, ApiResponse, ProductFilter } from '../types';
import { isValidPrice, isValidQuantity, sanitizeString } from '../utils/validation';
import mongoose from 'mongoose';

// In-memory storage as fallback when database is not connected
let memoryProducts: any[] = [
  {
    _id: 'sample1',
    name: 'Elegant Floral Summer Dress',
    description: 'Beautiful floral print dress perfect for summer occasions',
    price: 2499,
    discountPrice: 1999,
    images: ['/api/placeholder/400/600'],
    category: 'Summer Dresses',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Blue'],
    inStock: true,
    stockQuantity: 15,
    featured: true,
    tags: ['summer', 'floral', 'casual'],
    rating: 4.5,
    numReviews: 23,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  console.log('🚀 getProducts called - fallback system active');
  try {
    // Check if database is connected
    const isDbConnected = mongoose.connection.readyState === 1;
    console.log('📊 Database connection status:', isDbConnected);

    if (!isDbConnected) {
      // Use in-memory products as fallback
      const pageNum = Math.max(1, Number(req.query.page || 1));
      const limitNum = Math.min(50, Math.max(1, Number(req.query.limit || 12)));

      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully (from memory)',
        data: {
          products: memoryProducts,
          pagination: {
            currentPage: pageNum,
            totalPages: 1,
            totalProducts: memoryProducts.length,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      } as ApiResponse);
      return;
    }

    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      inStock,
      featured,
      sort = '-createdAt',
      search
    } = req.query as ProductFilter & { search?: string };

    // Build filter object
    const filter: any = {};

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
      filter.sizes = { $in: sizeArray };
    }

    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : [colors];
      filter.colors = { $in: colorArray };
    }

    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving products'
    } as ApiResponse);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response) => {
  try {
    // Check if database is connected
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // Use in-memory storage as fallback
      const product = memoryProducts.find(p => p._id === req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        } as ApiResponse);
      }

      res.status(200).json({
        success: true,
        message: 'Product retrieved successfully (from memory)',
        data: { product }
      } as ApiResponse);
      return;
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: { product }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving product'
    } as ApiResponse);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      sizes,
      colors,
      stockQuantity,
      featured = false,
      tags = []
    } = req.body;

    // Validation
    if (!name || !description || !price || !images || !category || !sizes || !colors) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      } as ApiResponse);
    }

    if (!isValidPrice(price)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid price'
      } as ApiResponse);
    }

    if (!isValidQuantity(stockQuantity)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid stock quantity'
      } as ApiResponse);
    }

    if (discountPrice && !isValidPrice(discountPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid discount price'
      } as ApiResponse);
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one image'
      } as ApiResponse);
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one size'
      } as ApiResponse);
    }

    if (!Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one color'
      } as ApiResponse);
    }

    // Check if database is connected
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // Use in-memory storage as fallback
      const newProduct = {
        _id: `temp_${Date.now()}`,
        name: sanitizeString(name),
        description: sanitizeString(description),
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        images,
        category: sanitizeString(category),
        sizes,
        colors,
        stockQuantity: Number(stockQuantity),
        inStock: Number(stockQuantity) > 0,
        featured: Boolean(featured),
        tags: tags.map((tag: string) => sanitizeString(tag)),
        rating: 0,
        numReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      memoryProducts.push(newProduct);

      res.status(201).json({
        success: true,
        message: 'Product created successfully (in memory)',
        data: { product: newProduct }
      } as ApiResponse);
      return;
    }

    const product = await Product.create({
      name: sanitizeString(name),
      description: sanitizeString(description),
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      images,
      category: sanitizeString(category),
      sizes,
      colors,
      stockQuantity: Number(stockQuantity),
      featured: Boolean(featured),
      tags: tags.map((tag: string) => sanitizeString(tag))
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product'
    } as ApiResponse);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      sizes,
      colors,
      stockQuantity,
      featured,
      tags
    } = req.body;

    // Update fields if provided
    if (name !== undefined) product.name = sanitizeString(name);
    if (description !== undefined) product.description = sanitizeString(description);
    if (price !== undefined) {
      if (!isValidPrice(price)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid price'
        } as ApiResponse);
      }
      product.price = Number(price);
    }
    if (discountPrice !== undefined) {
      if (discountPrice && !isValidPrice(discountPrice)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid discount price'
        } as ApiResponse);
      }
      product.discountPrice = discountPrice ? Number(discountPrice) : undefined;
    }
    if (images !== undefined) product.images = images;
    if (category !== undefined) product.category = sanitizeString(category);
    if (sizes !== undefined) product.sizes = sizes;
    if (colors !== undefined) product.colors = colors;
    if (stockQuantity !== undefined) {
      if (!isValidQuantity(stockQuantity)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid stock quantity'
        } as ApiResponse);
      }
      product.stockQuantity = Number(stockQuantity);
    }
    if (featured !== undefined) product.featured = Boolean(featured);
    if (tags !== undefined) product.tags = tags.map((tag: string) => sanitizeString(tag));

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product'
    } as ApiResponse);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    } as ApiResponse);
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    } as ApiResponse);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 8 } = req.query;

    // Check if database is connected
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // Use in-memory storage as fallback
      const featuredProducts = memoryProducts
        .filter(p => p.featured && p.inStock)
        .slice(0, Number(limit));

      res.status(200).json({
        success: true,
        message: 'Featured products retrieved successfully (from memory)',
        data: { products: featuredProducts }
      } as ApiResponse);
      return;
    }

    const products = await Product.find({ featured: true, inStock: true })
      .sort('-createdAt')
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: { products }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving featured products'
    } as ApiResponse);
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Check if database is connected
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // Use in-memory storage as fallback
      const categories = [...new Set(memoryProducts.map(p => p.category))];

      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully (from memory)',
        data: { categories }
      } as ApiResponse);
      return;
    }

    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: { categories }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving categories'
    } as ApiResponse);
  }
};