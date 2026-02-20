import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
/// <reference path="../types/google.d.ts" />

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  phone?: string;
  isAdmin: boolean;
  wishlist: string[];
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credential: string, isAdmin?: boolean) => Promise<void>;
  directLogin: (type: 'admin' | 'customer') => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Verify token with backend and get user data
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.data.user);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credential: string, isAdmin: boolean = false) => {
    try {
      setIsLoading(true);
      console.log('AuthContext login called with:', { credential: credential.substring(0, 50) + '...', isAdmin });

      // Send Google credential to backend for verification
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      console.log('Making request to:', `${apiUrl}/auth/google`);

      const response = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential, isAdmin }),
      });

      console.log('Backend response status:', response.status);
      console.log('Backend response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error response:', errorData);
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      console.log('Backend success response:', data);

      // Store token and user data
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;

      if (token) {
        localStorage.setItem('authToken', token);
      }

      if (user) {
        setUser(user);
      }

    } catch (error) {
      console.error('Login failed with error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);

    // Clear Google OAuth session
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const directLogin = async (type: 'admin' | 'customer') => {
    try {
      setIsLoading(true);

      // Use real backend login
      const credentials = type === 'admin'
        ? { email: 'admin@dreamfit.com', password: 'AdminPassword123!' }
        : { email: 'customer@dreamfit.com', password: 'CustomerPassword123!' };

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // If login fails, try to register first
        if (response.status === 401) {
          const registerResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: type === 'admin' ? 'Admin User' : 'Customer User',
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            localStorage.setItem('authToken', registerData.data.token);

            // Convert backend user format to frontend format
            const frontendUser: User = {
              id: registerData.data.user.id,
              name: registerData.data.user.name,
              email: registerData.data.user.email,
              isAdmin: registerData.data.user.isAdmin,
              wishlist: [],
              addresses: [],
              createdAt: registerData.data.user.createdAt,
            };
            setUser(frontendUser);
            return;
          }
        }
        throw new Error('Authentication failed');
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem('authToken', data.data.token);

      // Convert backend user format to frontend format
      const frontendUser: User = {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        isAdmin: data.data.user.isAdmin,
        wishlist: [],
        addresses: [],
        createdAt: data.data.user.createdAt,
      };
      setUser(frontendUser);

    } catch (error) {
      console.error('Direct login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });

      // Update user data on backend
      const token = localStorage.getItem('authToken');
      if (token) {
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData),
        }).catch(error => console.error('Update user failed:', error));
      }
    }
  };

  const addToWishlist = (productId: string) => {
    if (user && !user.wishlist.includes(productId)) {
      const updatedWishlist = [...user.wishlist, productId];
      updateUser({ wishlist: updatedWishlist });
    }
  };

  const removeFromWishlist = (productId: string) => {
    if (user) {
      const updatedWishlist = user.wishlist.filter(id => id !== productId);
      updateUser({ wishlist: updatedWishlist });
    }
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress: Address = {
        ...addressData,
        id: Date.now().toString(),
      };

      const updatedAddresses = [...user.addresses, newAddress];
      updateUser({ addresses: updatedAddresses });
    }
  };

  const updateAddress = (addressId: string, addressData: Partial<Address>) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr =>
        addr.id === addressId ? { ...addr, ...addressData } : addr
      );
      updateUser({ addresses: updatedAddresses });
    }
  };

  const deleteAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      updateUser({ addresses: updatedAddresses });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    directLogin,
    logout,
    updateUser,
    addToWishlist,
    removeFromWishlist,
    addAddress,
    updateAddress,
    deleteAddress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};