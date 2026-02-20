// Calculate shipping cost based on order total and destination
export const calculateShipping = (subtotal: number, state: string): number => {
  // Free shipping for orders above ₹1000
  if (subtotal >= 1000) {
    return 0;
  }

  // Different shipping rates for different states
  const shippingRates: { [key: string]: number } = {
    'Maharashtra': 40,
    'Gujarat': 50,
    'Rajasthan': 60,
    'Karnataka': 70,
    'Tamil Nadu': 70,
    'Andhra Pradesh': 80,
    'Telangana': 80,
    'Kerala': 90,
    'West Bengal': 100,
    'Odisha': 100,
    'Jharkhand': 110,
    'Bihar': 110,
    'Uttar Pradesh': 80,
    'Madhya Pradesh': 70,
    'Chhattisgarh': 90,
    'Assam': 120,
    'Tripura': 130,
    'Manipur': 130,
    'Nagaland': 130,
    'Mizoram': 130,
    'Arunachal Pradesh': 140,
    'Meghalaya': 120,
    'Sikkim': 110,
    'Himachal Pradesh': 80,
    'Uttarakhand': 80,
    'Punjab': 70,
    'Haryana': 60,
    'Delhi': 50,
    'Chandigarh': 70,
    'Puducherry': 80,
    'Goa': 60,
    'Jammu and Kashmir': 100,
    'Ladakh': 120
  };

  return shippingRates[state] || 60; // Default shipping cost
};

// Calculate tax (GST) - 18% on clothing
export const calculateTax = (subtotal: number): number => {
  const gstRate = 0.18; // 18% GST
  return Math.round(subtotal * gstRate);
};

// Generate UPI payment link
export const generateUPILink = (amount: number, orderNumber: string, merchantUPI: string = 'dreamfit@paytm'): string => {
  const payeeName = 'DreamFit';
  const transactionNote = `Order-${orderNumber}`;

  return `upi://pay?pa=${merchantUPI}&pn=${payeeName}&am=${amount}&cu=INR&tn=${transactionNote}`;
};

// Calculate estimated delivery date
export const calculateEstimatedDelivery = (shippingState: string, orderDate: Date = new Date()): Date => {
  const deliveryDays: { [key: string]: number } = {
    'Maharashtra': 1,
    'Gujarat': 2,
    'Rajasthan': 3,
    'Karnataka': 2,
    'Tamil Nadu': 3,
    'Andhra Pradesh': 3,
    'Telangana': 3,
    'Kerala': 4,
    'West Bengal': 4,
    'Odisha': 4,
    'Jharkhand': 5,
    'Bihar': 5,
    'Uttar Pradesh': 3,
    'Madhya Pradesh': 3,
    'Chhattisgarh': 4,
    'Assam': 6,
    'Tripura': 7,
    'Manipur': 7,
    'Nagaland': 7,
    'Mizoram': 7,
    'Arunachal Pradesh': 8,
    'Meghalaya': 6,
    'Sikkim': 5,
    'Himachal Pradesh': 3,
    'Uttarakhand': 3,
    'Punjab': 2,
    'Haryana': 2,
    'Delhi': 1,
    'Chandigarh': 2,
    'Puducherry': 3,
    'Goa': 2,
    'Jammu and Kashmir': 5,
    'Ladakh': 6
  };

  const days = deliveryDays[shippingState] || 4; // Default 4 days
  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(estimatedDate.getDate() + days);

  return estimatedDate;
};

// Format order number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}${random}`;
};

// Validate order items
export const validateOrderItems = (items: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    errors.push('Order must contain at least one item');
    return { isValid: false, errors };
  }

  items.forEach((item, index) => {
    if (!item.product) {
      errors.push(`Item ${index + 1}: Product ID is required`);
    }

    if (!item.quantity || item.quantity < 1) {
      errors.push(`Item ${index + 1}: Valid quantity is required`);
    }

    if (!item.size) {
      errors.push(`Item ${index + 1}: Size is required`);
    }

    if (!item.color) {
      errors.push(`Item ${index + 1}: Color is required`);
    }

    if (!item.price || item.price < 0) {
      errors.push(`Item ${index + 1}: Valid price is required`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

// Get order status color for UI
export const getOrderStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'confirmed': 'text-blue-600 bg-blue-100',
    'processing': 'text-purple-600 bg-purple-100',
    'shipped': 'text-indigo-600 bg-indigo-100',
    'delivered': 'text-green-600 bg-green-100',
    'cancelled': 'text-red-600 bg-red-100'
  };

  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

// Get payment status color for UI
export const getPaymentStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'completed': 'text-green-600 bg-green-100',
    'failed': 'text-red-600 bg-red-100',
    'refunded': 'text-purple-600 bg-purple-100'
  };

  return statusColors[status] || 'text-gray-600 bg-gray-100';
};