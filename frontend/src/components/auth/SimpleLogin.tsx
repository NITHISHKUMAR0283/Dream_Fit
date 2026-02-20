import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Shield, ArrowRight } from 'lucide-react';

interface SimpleLoginProps {
  onClose?: () => void;
  redirectTo?: string;
}

const SimpleLogin: React.FC<SimpleLoginProps> = ({
  onClose,
  redirectTo = '/'
}) => {
  const { directLogin, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (type: 'admin' | 'customer') => {
    try {
      setError(null);
      await directLogin(type);

      // Redirect or close modal
      if (onClose) {
        onClose();
      } else {
        window.location.href = redirectTo;
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full bg-white px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-gray-600 text-sm">
          Quick demo access - no signup required
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Login Buttons */}
      <div className="space-y-3 mb-8">
        {/* Customer Login */}
        <button
          onClick={() => handleLogin('customer')}
          disabled={isLoading}
          className="w-full group relative overflow-hidden p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl hover:border-indigo-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:to-blue-500/5 transition-all duration-200"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg">Customer</div>
                <div className="text-sm text-gray-600">Browse & shop</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Admin Login */}
        <button
          onClick={() => handleLogin('admin')}
          disabled={isLoading}
          className="w-full group relative overflow-hidden p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-200"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg">Admin</div>
                <div className="text-sm text-gray-600">Manage store</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Features */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Access Features
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></div>
            <span className="text-sm text-gray-700">Browse products</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
            <span className="text-sm text-gray-700">Manage inventory</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></div>
            <span className="text-sm text-gray-700">Add to cart</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
            <span className="text-sm text-gray-700">View analytics</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></div>
            <span className="text-sm text-gray-700">Track orders</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
            <span className="text-sm text-gray-700">Process orders</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6 flex items-center justify-center py-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent mr-3"></div>
          <span className="text-indigo-700 font-medium">Logging in...</span>
        </div>
      )}
    </div>
  );
};

export default SimpleLogin;