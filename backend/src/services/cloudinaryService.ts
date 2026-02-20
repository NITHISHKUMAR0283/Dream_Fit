import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary';
import { CloudinaryUploadResult } from '../types';

// Upload single image to Cloudinary
export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string = 'dreamfit/products',
  options: any = {}
): Promise<CloudinaryUploadResult> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not properly configured');
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error('Upload failed'));
        }
      }
    ).end(fileBuffer);
  });
};

// Upload multiple images to Cloudinary
export const uploadMultipleImages = async (
  fileBuffers: Buffer[],
  folder: string = 'dreamfit/products',
  options: any = {}
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = fileBuffers.map(buffer =>
    uploadImage(buffer, folder, options)
  );

  return Promise.all(uploadPromises);
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<any> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not properly configured');
  }

  return cloudinary.uploader.destroy(publicId);
};

// Delete multiple images from Cloudinary
export const deleteMultipleImages = async (publicIds: string[]): Promise<any> => {
  const deletePromises = publicIds.map(publicId => deleteImage(publicId));
  return Promise.all(deletePromises);
};

// Transform image URL for different sizes
export const getTransformedImageUrl = (
  publicId: string,
  transformations: string = 'c_fill,f_auto,q_auto'
): string => {
  return cloudinary.url(publicId, {
    transformation: transformations
  });
};

// Get optimized image URLs for different use cases
export const getOptimizedImageUrls = (publicId: string) => {
  return {
    thumbnail: getTransformedImageUrl(publicId, 'c_fill,f_auto,q_auto,w_150,h_200'),
    small: getTransformedImageUrl(publicId, 'c_fill,f_auto,q_auto,w_300,h_400'),
    medium: getTransformedImageUrl(publicId, 'c_fill,f_auto,q_auto,w_600,h_800'),
    large: getTransformedImageUrl(publicId, 'c_fill,f_auto,q_auto,w_1200,h_1600'),
    original: getTransformedImageUrl(publicId, 'f_auto,q_auto')
  };
};

// Extract public ID from Cloudinary URL
export const extractPublicId = (cloudinaryUrl: string): string => {
  const regex = /\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/i;
  const match = cloudinaryUrl.match(regex);
  return match ? match[1] : '';
};