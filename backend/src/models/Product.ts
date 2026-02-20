import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(this: IProduct, value: number) {
        return !value || value < this.price;
      },
      message: 'Discount price must be less than original price'
    }
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(images: string[]) {
        return images.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  sizes: {
    type: [String],
    required: [true, 'At least one size is required'],
    validate: {
      validator: function(sizes: string[]) {
        return sizes.length > 0;
      },
      message: 'At least one size is required'
    }
  },
  colors: {
    type: [String],
    required: [true, 'At least one color is required'],
    validate: {
      validator: function(colors: string[]) {
        return colors.length > 0;
      },
      message: 'At least one color is required'
    }
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Number of reviews cannot be negative']
  }
}, {
  timestamps: true
});

// Update inStock based on stockQuantity
ProductSchema.pre('save', function(next) {
  this.inStock = this.stockQuantity > 0;
  next();
});

// Create indexes for better search performance
ProductSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.model<IProduct>('Product', ProductSchema);