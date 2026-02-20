import express from 'express';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
} from '../controllers/favoritesController';
import { protect } from '../middleware/supabaseAuth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/favorites
// @desc    Get user's favorite products
// @access  Private
router.get('/', getFavorites);

// @route   GET /api/favorites/check/:productId
// @desc    Check if product is in user's favorites
// @access  Private
router.get('/check/:productId', checkFavorite);

// @route   POST /api/favorites/:productId
// @desc    Add product to favorites
// @access  Private
router.post('/:productId', addToFavorites);

// @route   DELETE /api/favorites/:productId
// @desc    Remove product from favorites
// @access  Private
router.delete('/:productId', removeFromFavorites);

export default router;