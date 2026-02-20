import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    rating: number;
    numReviews: number;
    tags?: string[];
    featured?: boolean;
    inStock: boolean;
  };
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (productId: string) => void;
  onQuickView?: (product: any) => void;
  isWishlisted?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isWishlisted = false,
  className,
  size = 'md',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleImageHover = (index: number) => {
    setCurrentImageIndex(index);
  };

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-md',
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 transform hover:-translate-y-2',
        sizeClasses[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Main Image */}
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image Dots Indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentImageIndex
                    ? 'bg-white shadow-md'
                    : 'bg-white/50 hover:bg-white/70'
                )}
                onMouseEnter={() => handleImageHover(index)}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {!product.inStock && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-neutral-900 rounded-full">
              Out of Stock
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={cn(
          'absolute top-3 right-3 flex flex-col space-y-2 transform transition-all duration-300',
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        )}>
          <button
            onClick={() => onToggleWishlist?.(product.id)}
            className={cn(
              'p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110',
              isWishlisted
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-primary-500'
            )}
          >
            <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
          </button>

          <button
            onClick={() => onQuickView?.(product)}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white hover:text-primary-500 transition-all duration-300 hover:scale-110"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add to Cart - Shows on hover */}
        <div className={cn(
          'absolute bottom-4 left-4 right-4 transform transition-all duration-500',
          isHovered && product.inStock ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}>
          <Button
            variant="elegant"
            size="sm"
            fullWidth
            onClick={() => onAddToCart?.(product)}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
            className="backdrop-blur-sm bg-white/90 hover:bg-white"
          >
            Add to Cart
          </Button>
        </div>

        {/* Gradient overlay on hover */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )} />
      </div>

      {/* Product Information */}
      <div className="p-5 space-y-3">
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-2xs font-medium text-secondary-600 bg-secondary-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-medium text-neutral-900 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3 h-3',
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-neutral-300'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500">
            ({product.numReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  ₹{product.discountPrice.toLocaleString()}
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-neutral-900">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart */}
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            className="sm:hidden p-2 rounded-full bg-primary-500 text-white disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* View Product Button - Hidden on mobile, shows on larger screens */}
        <div className="hidden sm:block pt-2">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Floating elements for premium feel */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full opacity-15 group-hover:opacity-30 transition-opacity duration-300" />
    </div>
  );
};

export default ProductCard;