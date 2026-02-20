import { IAddress } from '../types';

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Phone validation (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Password strength validation
export const isStrongPassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true, message: 'Password is strong' };
};

// Pincode validation (Indian format)
export const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Address validation
export const validateAddress = (address: IAddress): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!address.street || address.street.trim().length < 5) {
    errors.push('Street address must be at least 5 characters long');
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is required');
  }

  if (!address.state || address.state.trim().length < 2) {
    errors.push('State is required');
  }

  if (!address.pincode || !isValidPincode(address.pincode)) {
    errors.push('Valid pincode is required');
  }

  if (!address.country || address.country.trim().length < 2) {
    errors.push('Country is required');
  }

  return { isValid: errors.length === 0, errors };
};

// Product validation helpers
export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price > 0 && price <= 1000000;
};

export const isValidQuantity = (quantity: number): boolean => {
  return typeof quantity === 'number' && quantity >= 0 && Number.isInteger(quantity);
};

// Sanitize strings
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

// UPI ID validation
export const isValidUPIId = (upiId: string): boolean => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;
  return upiRegex.test(upiId);
};