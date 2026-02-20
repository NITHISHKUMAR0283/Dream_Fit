import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number; // Price at the time of adding to cart
  addedAt: string;
}

export interface ShippingInfo {
  method: 'standard' | 'express';
  cost: number;
  estimatedDelivery: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  shippingInfo: ShippingInfo;
  isLoading: boolean;
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemOptions: (itemId: string, size: string, color: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => Promise<boolean>;
  removeDiscount: () => void;
  setShippingMethod: (method: 'standard' | 'express') => void;
  saveForLater: (itemId: string) => void;
  moveToCart: (itemId: string) => void;
  getSavedItems: () => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    method: 'standard',
    cost: 0,
    estimatedDelivery: '5-7 business days'
  });
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage();
  }, [items, savedItems, shippingInfo, discountCode, discountAmount]);

  const loadCartFromStorage = () => {
    try {
      const cartData = localStorage.getItem('dreamfit_cart');
      const savedData = localStorage.getItem('dreamfit_saved_items');
      const shippingData = localStorage.getItem('dreamfit_shipping');
      const discountData = localStorage.getItem('dreamfit_discount');

      if (cartData) {
        setItems(JSON.parse(cartData));
      }
      if (savedData) {
        setSavedItems(JSON.parse(savedData));
      }
      if (shippingData) {
        setShippingInfo(JSON.parse(shippingData));
      }
      if (discountData) {
        const discount = JSON.parse(discountData);
        setDiscountCode(discount.code);
        setDiscountAmount(discount.amount);
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  };

  const saveCartToStorage = () => {
    try {
      localStorage.setItem('dreamfit_cart', JSON.stringify(items));
      localStorage.setItem('dreamfit_saved_items', JSON.stringify(savedItems));
      localStorage.setItem('dreamfit_shipping', JSON.stringify(shippingInfo));

      if (discountCode) {
        localStorage.setItem('dreamfit_discount', JSON.stringify({
          code: discountCode,
          amount: discountAmount
        }));
      } else {
        localStorage.removeItem('dreamfit_discount');
      }
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  };

  const generateItemId = (product: Product, size: string, color: string): string => {
    return `${product._id}-${size}-${color}`;
  };

  const addItem = (product: Product, quantity: number, size: string, color: string) => {
    const itemId = generateItemId(product, size, color);
    const existingItemIndex = items.findIndex(item => item.id === itemId);

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: itemId,
        product,
        quantity,
        size,
        color,
        price: product.discountPrice || product.price,
        addedAt: new Date().toISOString()
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const updateItemOptions = (itemId: string, size: string, color: string) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    const newItemId = generateItemId(item.product, size, color);

    // Check if item with new options already exists
    const existingItem = items.find(item => item.id === newItemId);

    if (existingItem && newItemId !== itemId) {
      // Merge with existing item
      existingItem.quantity += item.quantity;
      removeItem(itemId);
    } else {
      // Update current item
      setItems(items.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, id: newItemId, size, color }
          : cartItem
      ));
    }
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
    setDiscountAmount(0);
  };

  const applyDiscount = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call to validate discount code
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock discount validation
      const discountCodes: Record<string, number> = {
        'WELCOME10': 10,
        'SAVE20': 20,
        'FIRST50': 50,
        'STUDENT15': 15,
        'SUMMER25': 25
      };

      const discountPercentage = discountCodes[code.toUpperCase()];

      if (discountPercentage) {
        setDiscountCode(code.toUpperCase());
        setDiscountAmount(discountPercentage);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to apply discount:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeDiscount = () => {
    setDiscountCode(null);
    setDiscountAmount(0);
  };

  const setShippingMethod = (method: 'standard' | 'express') => {
    const shippingCosts = {
      standard: { cost: 0, delivery: '5-7 business days' },
      express: { cost: 150, delivery: '1-2 business days' }
    };

    setShippingInfo({
      method,
      cost: shippingCosts[method].cost,
      estimatedDelivery: shippingCosts[method].delivery
    });
  };

  const saveForLater = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      setSavedItems([...savedItems, item]);
      removeItem(itemId);
    }
  };

  const moveToCart = (itemId: string) => {
    const savedItem = savedItems.find(item => item.id === itemId);
    if (savedItem) {
      setItems([...items, savedItem]);
      setSavedItems(savedItems.filter(item => item.id !== itemId));
    }
  };

  const getSavedItems = () => savedItems;

  // Calculate cart summary
  const summary: CartSummary = React.useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (subtotal * discountAmount) / 100;
    const shipping = subtotal > 1500 ? 0 : shippingInfo.cost; // Free shipping over ₹1500
    const tax = (subtotal - discount) * 0.18; // 18% GST
    const total = subtotal - discount + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [items, discountAmount, shippingInfo.cost]);

  const value: CartContextType = {
    items,
    summary,
    shippingInfo,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    updateItemOptions,
    clearCart,
    applyDiscount,
    removeDiscount,
    setShippingMethod,
    saveForLater,
    moveToCart,
    getSavedItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};