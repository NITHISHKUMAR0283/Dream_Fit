import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories
} from '../controllers/productController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/', (req, res, next) => {
  console.log('🚀 Product route / called');
  getProducts(req, res);
});
router.get('/:id', getProduct);

// Protected admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;