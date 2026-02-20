import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Minus, Plus, Trash2, Heart, ArrowLeft, ShoppingBag,
  Tag, Truck, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const {
    items,
    summary,
    shippingInfo,
    isLoading,
    removeItem,
    updateQuantity,
    updateItemOptions,
    clearCart,
    applyDiscount,
    removeDiscount,
    setShippingMethod,
    saveForLater,
    moveToCart,
    getSavedItems
  } = useCart();

  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = useState(false);
  const savedItems = getSavedItems();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setDiscountError(null);
    setDiscountSuccess(false);

    const success = await applyDiscount(discountCode.trim());

    if (success) {
      setDiscountSuccess(true);
      setDiscountCode('');
      setTimeout(() => setDiscountSuccess(false), 3000);
    } else {
      setDiscountError('Invalid discount code. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">
              Start shopping to add items to your cart
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-1.5 text-sm sm:text-base text-gray-600">
            {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Active Cart Items */}
            {items.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                      {/* Product Image */}
                      <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                        <img
                          src={item.product.images[0] || '/api/placeholder/150/200'}
                          alt={item.product.name}
                          className="w-20 h-28 object-cover rounded-md"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>

                        {/* Size and Color */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 min-w-[40px]">Size:</span>
                            <select
                              value={item.size}
                              onChange={(e) => updateItemOptions(item.id, e.target.value, item.color)}
                              className="text-sm border border-gray-200 rounded px-3 py-2 min-h-[44px] min-w-[80px]"
                            >
                              {item.product.sizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 min-w-[45px]">Color:</span>
                            <select
                              value={item.color}
                              onChange={(e) => updateItemOptions(item.id, item.size, e.target.value)}
                              className="text-sm border border-gray-200 rounded px-3 py-2 min-h-[44px] min-w-[100px]"
                            >
                              {item.product.colors.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.price)}
                            </span>
                            {item.product.discountPrice && item.product.price > item.product.discountPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.product.price)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end sm:space-x-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-3 sm:p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-5 w-5 sm:h-4 sm:w-4" />
                              </button>
                              <span className="px-4 py-3 sm:py-2 text-sm font-medium min-w-[60px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-3 sm:p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              >
                                <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <button
                              onClick={() => saveForLater(item.id)}
                              className="p-3 sm:p-2 text-gray-400 hover:text-primary-600 active:text-primary-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Save for later"
                            >
                              <Heart className="h-5 w-5 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-3 sm:p-2 text-gray-400 hover:text-red-600 active:text-red-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Remove item"
                            >
                              <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Saved for Later</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={item.product.images[0] || '/api/placeholder/150/200'}
                        alt={item.product.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h3 className="font-medium text-gray-900 text-sm mb-2">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{formatPrice(item.price)}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveToCart(item.id)}
                          className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="px-3 py-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                {/* Discount Code */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Discount Code
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={isLoading || !discountCode.trim()}
                      className="px-4 py-3 sm:py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 disabled:bg-gray-300 transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      <Tag className="h-5 w-5 sm:h-4 sm:w-4" />
                      <span className="ml-2 sm:hidden">Apply Code</span>
                    </button>
                  </div>

                  {discountError && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {discountError}
                    </div>
                  )}

                  {discountSuccess && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Discount applied successfully!
                    </div>
                  )}
                </div>

                {/* Shipping Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Shipping Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={shippingInfo.method === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Standard Shipping</span>
                          <span className="text-green-600 font-medium">FREE</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          5-7 business days
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={shippingInfo.method === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Express Shipping</span>
                          <span className="font-medium">{formatPrice(150)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Truck className="h-3 w-3 mr-1" />
                          1-2 business days
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({summary.itemCount} items)</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>

                  {summary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(summary.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{summary.shipping > 0 ? formatPrice(summary.shipping) : 'FREE'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(summary.tax)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(summary.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {summary.subtotal < 1500 && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      Add {formatPrice(1500 - summary.subtotal)} more for FREE shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full bg-primary-600 text-white py-4 sm:py-3 px-4 rounded-lg font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 flex items-center justify-center min-h-[48px] text-base sm:text-sm"
                  >
                    Proceed to Checkout
                    <ArrowLeft className="ml-2 h-5 w-5 sm:h-4 sm:w-4 rotate-180" />
                  </Link>

                  <Link
                    to="/shop"
                    className="w-full bg-white text-primary-600 py-4 sm:py-3 px-4 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 active:bg-primary-100 transition-colors duration-200 flex items-center justify-center min-h-[48px] text-base sm:text-sm"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;