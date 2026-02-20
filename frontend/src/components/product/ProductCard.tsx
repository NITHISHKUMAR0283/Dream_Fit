import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, size: string, color: string) => void;
  onToggleWishlist?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  isInWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [heartPulse, setHeartPulse] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && product.sizes.length > 0 && product.colors.length > 0) {
      onAddToCart(product._id, product.sizes[0], product.colors[0]);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      setHeartPulse(true);
      setTimeout(() => setHeartPulse(false), 500);
      onToggleWishlist(product._id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl
                 transition-all duration-300 overflow-hidden
                 hover:scale-[1.01] transform-gpu border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 rounded-t-2xl">
          {product.images && product.images.length > 0 && product.images[selectedImageIndex] ? (
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 ease-out
                         group-hover:scale-110"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://via.placeholder.com/400x500/fdf2f8/ec4899?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400 text-sm">No Image</p>
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercentage > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500 text-white text-xs font-semibold rounded-full shadow-md">
                <Sparkles className="w-3 h-3" />
                {discountPercentage}% OFF
              </span>
            )}
            {product.tags?.includes('new') && (
              <span className="inline-flex items-center px-2.5 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full shadow-md">
                NEW
              </span>
            )}
            {product.tags?.includes('trending') && (
              <span className="inline-flex items-center px-2.5 py-1 bg-pink-500 text-white text-xs font-semibold rounded-full shadow-md">
                TRENDING
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full
                       backdrop-blur-md shadow-md transition-all duration-300 hover:scale-110 active:scale-95 min-h-0 ${
              isInWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            } ${heartPulse ? 'animate-pulse-heart' : ''}`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button - Shows on Hover */}
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className={`absolute top-3 right-14 w-9 h-9 flex items-center justify-center rounded-full
                         backdrop-blur-md shadow-md transition-all duration-300 hover:scale-110 active:scale-95 min-h-0
                         bg-white/90 text-gray-700 hover:bg-white ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          {/* Image Indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageChange(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 min-h-0 ${
                    index === selectedImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick Add to Cart Button - Shows on Hover */}
          <div className={`absolute inset-x-4 bottom-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm
                         transition-all duration-200 shadow-xl backdrop-blur-md min-h-0 ${
                product.inStock
                  ? 'bg-white text-gray-900 hover:bg-gray-50'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? 'Quick Add' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-gray-700">4.5</span>
              <span className="text-xs text-gray-400">(28)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              ₹{((product.discountPrice || product.price) / 100).toFixed(0)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{(product.price / 100).toFixed(0)}
              </span>
            )}
          </div>

          {/* Available Sizes */}
          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-2 py-0.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs font-medium rounded-md border border-gray-200">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Stock Status */}
          {!product.inStock && (
            <div className="mt-2.5 text-center">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;