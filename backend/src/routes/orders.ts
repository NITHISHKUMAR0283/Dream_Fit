import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
  getAllOrders,
  getOrderAnalytics
} from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateOrder } from '../middleware/validation';

const router = express.Router();

// User routes (require authentication)
router.post('/', authenticate, validateOrder, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/cancel', authenticate, cancelOrder);
router.patch('/:id/payment', authenticate, updatePaymentStatus);

// Admin routes (require admin privileges)
router.get('/', authenticate, requireAdmin, getAllOrders);
router.get('/analytics/summary', authenticate, requireAdmin, getOrderAnalytics);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;