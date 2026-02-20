import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest, ApiResponse } from '../types';

// @desc    Get user's cart items
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        size,
        color,
        created_at,
        updated_at,
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
          stock_quantity,
          in_stock
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get cart error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching cart items'
      } as ApiResponse);
    }

    // Calculate totals
    const subtotal = cartItems?.reduce((total, item) => {
      const price = item.product.discount_price || item.product.price;
      return total + (price * item.quantity);
    }, 0) || 0;

    const itemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: {
        cartItems: cartItems || [],
        summary: {
          itemCount,
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat((subtotal * 0.1).toFixed(2)), // 10% tax
          total: parseFloat((subtotal * 1.1).toFixed(2))
        }
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart'
    } as ApiResponse);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      } as ApiResponse);
    }

    if (!size || !color) {
      return res.status(400).json({
        success: false,
        message: 'Size and color are required'
      } as ApiResponse);
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      } as ApiResponse);
    }

    // Check if product exists and is in stock
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, stock_quantity, in_stock, sizes, colors')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

    if (!product.in_stock || product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock or insufficient quantity'
      } as ApiResponse);
    }

    // Validate size and color
    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size selected'
      } as ApiResponse);
    }

    if (!product.colors.includes(color)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid color selected'
      } as ApiResponse);
    }

    // Check if item already exists in cart with same product, size, color
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .single();

    if (existingItem && !checkError) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({
          success: false,
          message: 'Total quantity exceeds available stock'
        } as ApiResponse);
      }

      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (updateError) {
        console.error('Update cart item error:', updateError);
        return res.status(500).json({
          success: false,
          message: 'Error updating cart item'
        } as ApiResponse);
      }

      return res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        data: { cartItem: updatedItem }
      } as ApiResponse);
    }

    // Add new item to cart
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: req.user.id,
        product_id: productId,
        quantity,
        size,
        color
      })
      .select()
      .single();

    if (error) {
      console.error('Add to cart error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error adding item to cart'
      } as ApiResponse);
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cartItem }
    } as ApiResponse);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to cart'
    } as ApiResponse);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      } as ApiResponse);
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      } as ApiResponse);
    }

    // Get cart item with product info
    const { data: cartItem, error: itemError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products (
          id,
          stock_quantity,
          in_stock
        )
      `)
      .eq('id', itemId)
      .eq('user_id', req.user.id)
      .single();

    if (itemError || !cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      } as ApiResponse);
    }

    if (!cartItem.product.in_stock || quantity > cartItem.product.stock_quantity) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity exceeds available stock'
      } as ApiResponse);
    }

    // Update quantity
    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Update cart item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating cart item'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: { cartItem: updatedItem }
    } as ApiResponse);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart item'
    } as ApiResponse);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      } as ApiResponse);
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Remove from cart error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error removing item from cart'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from cart'
    } as ApiResponse);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse);
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Clear cart error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error clearing cart'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart'
    } as ApiResponse);
  }
};