import express from 'express';
import { protect, admin } from '../middleware/auth';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getOrders,
  updateOrderStatus,
  getProducts,
  updateProduct,
  deleteProduct,
  getContentPages,
  updateContentPage
} from '../controllers/adminController';

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(admin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Order management routes
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Product management routes
router.get('/products', getProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Content management routes
router.get('/content', getContentPages);
router.put('/content/:page', updateContentPage);

export default router;