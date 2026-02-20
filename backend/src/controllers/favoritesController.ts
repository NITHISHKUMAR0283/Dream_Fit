import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest, ApiResponse } from '../types';

// @desc    Get user's favorite products
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        product:products (
          id,
          name,
          description,
          price,
          discount_price,
          images,
          category,
          sizes,
          colors,
          in_stock,
          featured,
          rating,
          num_reviews
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get favorites error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching favorites'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Favorites retrieved successfully',
      data: {
        favorites: favorites || [],
        count: favorites?.length || 0
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching favorites'
    } as ApiResponse);
  }
};

// @desc    Add product to favorites
// @route   POST /api/favorites/:productId
// @access  Private
export const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      } as ApiResponse);
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

    // Check if already in favorites
    const { data: existingFavorite, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (existingFavorite && !checkError) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      } as ApiResponse);
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: req.user.id,
        product_id: productId
      })
      .select()
      .single();

    if (error) {
      console.error('Add to favorites error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error adding to favorites'
      } as ApiResponse);
    }

    res.status(201).json({
      success: true,
      message: 'Product added to favorites',
      data: { favorite }
    } as ApiResponse);
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to favorites'
    } as ApiResponse);
  }
};

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      } as ApiResponse);
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Remove from favorites error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error removing from favorites'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from favorites'
    } as ApiResponse);
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from favorites'
    } as ApiResponse);
  }
};

// @desc    Check if product is in user's favorites
// @route   GET /api/favorites/check/:productId
// @access  Private
export const checkFavorite = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      } as ApiResponse);
    }

    const { data: favorite, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Check favorite error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking favorite status'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      data: {
        isFavorite: !!favorite
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking favorite status'
    } as ApiResponse);
  }
};