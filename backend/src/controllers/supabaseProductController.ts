import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest, ApiResponse } from '../types';
import { isValidPrice, isValidQuantity, sanitizeString } from '../utils/validation';

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  console.log('🔍 getProducts API called');
  try {
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
      search
    } = req.query;

    let query = supabase.from('products').select('*', { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    if (minPrice) {
      query = query.gte('price', Number(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', Number(maxPrice));
    }

    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
      query = query.overlaps('sizes', sizeArray);
    }

    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : [colors];
      query = query.overlaps('colors', colorArray);
    }

    if (inStock !== undefined) {
      query = query.eq('in_stock', inStock === 'true');
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true');
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Calculate pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        message: 'Error retrieving products',
        error: error.message
      } as ApiResponse);
    }

    const totalPages = Math.ceil((count || 0) / limitNum);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts: count || 0,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('❌ Get products error:', error);
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error stack:', error?.stack);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving products',
      error: error?.message
    } as ApiResponse);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) {
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

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: sanitizeString(name),
        description: sanitizeString(description),
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : null,
        images,
        category: sanitizeString(category),
        sizes,
        colors,
        stock_quantity: Number(stockQuantity),
        in_stock: Number(stockQuantity) > 0,
        featured: Boolean(featured),
        tags: tags.map((tag: string) => sanitizeString(tag))
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase create error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating product'
      } as ApiResponse);
    }

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
    const { id } = req.params;
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

    if (
      name == null ||
      description == null ||
      price == null ||
      images == null ||
      category == null ||
      sizes == null ||
      colors == null ||
      stockQuantity == null
    ) {
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

    const { data: product, error } = await supabase
      .from('products')
      .update({
        name: sanitizeString(name),
        description: sanitizeString(description),
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : null,
        images,
        category: sanitizeString(category),
        sizes,
        colors,
        stock_quantity: Number(stockQuantity),
        in_stock: Number(stockQuantity) > 0,
        featured: Boolean(featured),
        tags: tags.map((tag: string) => sanitizeString(tag))
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !product) {
      console.error('Supabase update error:', error);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

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
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !product) {
      console.error('Supabase delete error:', error);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

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

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (error) {
      console.error('Supabase featured products error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving featured products'
      } as ApiResponse);
    }

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
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      console.error('Supabase categories error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving categories'
      } as ApiResponse);
    }

    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category))];

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