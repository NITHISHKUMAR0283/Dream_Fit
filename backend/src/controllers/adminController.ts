import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { AuthRequest, ApiResponse } from '../types';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Get pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id user totalAmount status createdAt');

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: {
        _id: '$items.productId',
        totalSales: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }},
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' },
      { $project: {
        name: '$product.name',
        sales: '$totalSales',
        revenue: '$totalRevenue',
        stock: '$product.stock'
      }}
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          todayOrders,
          pendingOrders
        },
        recentOrders,
        topProducts
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving dashboard stats'
    } as ApiResponse);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    } as ApiResponse);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user role'
    } as ApiResponse);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    } as ApiResponse);
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    } as ApiResponse);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string || '';

    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving orders'
    } as ApiResponse);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      } as ApiResponse);
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      } as ApiResponse);
    }

    order.status = status;
    if (status === 'shipped') {
      order.shippedAt = new Date();
    } else if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status'
    } as ApiResponse);
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
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

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!product) {
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
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
    }

    await Product.findByIdAndDelete(id);

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

// @desc    Get content pages
// @route   GET /api/admin/content
// @access  Private/Admin
export const getContentPages = async (req: AuthRequest, res: Response) => {
  try {
    // This would typically fetch from a database table for page content
    // For now, returning mock data structure
    const contentPages = {
      about: {
        title: 'About DreamFit',
        content: 'We are passionate about providing premium women\'s fashion...',
        lastUpdated: new Date()
      },
      contact: {
        title: 'Contact Us',
        content: 'Get in touch with our customer service team...',
        address: '123 Fashion Street, Mumbai, India',
        phone: '+91 98765 43210',
        email: 'contact@dreamfit.com',
        lastUpdated: new Date()
      },
      categories: {
        title: 'Our Categories',
        categories: [
          { name: 'Evening Dresses', description: 'Elegant dresses for special occasions' },
          { name: 'Casual Wear', description: 'Comfortable everyday fashion' },
          { name: 'Formal Wear', description: 'Professional and business attire' }
        ],
        lastUpdated: new Date()
      }
    };

    res.status(200).json({
      success: true,
      data: { contentPages }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get content pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving content pages'
    } as ApiResponse);
  }
};

// @desc    Update content page
// @route   PUT /api/admin/content/:page
// @access  Private/Admin
export const updateContentPage = async (req: AuthRequest, res: Response) => {
  try {
    const { page } = req.params;
    const updateData = req.body;

    // This would typically update the database
    // For now, just returning success response
    res.status(200).json({
      success: true,
      message: `${page} page updated successfully`,
      data: { page, updateData }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Update content page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating content page'
    } as ApiResponse);
  }
};