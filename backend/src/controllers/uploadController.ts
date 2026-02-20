import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { uploadImage, uploadMultipleImages } from '../services/cloudinaryService';

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private/Admin
export const uploadSingleImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      } as ApiResponse);
    }

    const { folder = 'dreamfit/products' } = req.body;

    // Upload to Cloudinary
    const result = await uploadImage(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading image'
    } as ApiResponse);
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private/Admin
export const uploadMultipleImagesController = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      } as ApiResponse);
    }

    const { folder = 'dreamfit/products' } = req.body;

    // Extract file buffers
    const fileBuffers = files.map(file => file.buffer);

    // Upload to Cloudinary
    const results = await uploadMultipleImages(fileBuffers, folder);

    const imageData = results.map(result => ({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: imageData,
        count: imageData.length
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Upload multiple images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading images'
    } as ApiResponse);
  }
};