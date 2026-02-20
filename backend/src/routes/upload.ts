import express from 'express';
import { uploadSingleImage, uploadMultipleImagesController } from '../controllers/uploadController';
import { protect, admin } from '../middleware/auth';
import { uploadSingle, uploadMultiple } from '../middleware/upload';

const router = express.Router();

// Protected admin routes for image uploads
router.post('/image', protect, admin, uploadSingle, uploadSingleImage);
router.post('/images', protect, admin, uploadMultiple, uploadMultipleImagesController);

export default router;