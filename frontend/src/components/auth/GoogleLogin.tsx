import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin as GoogleOAuthLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { User, Shield, AlertCircle } from 'lucide-react';

interface GoogleLoginProps {
  onClose?: () => void;
  redirectTo?: string;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({
  onClose,
  redirectTo = '/'
}) => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Admin email - only this email will have admin access
  const ADMIN_EMAIL = 'nk0283@srmist.edu.in';

  // Google OAuth Client ID - Replace with your actual client ID
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com";

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setError(null);
      console.log('Google auth success callback triggered', credentialResponse);

      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Decode the JWT token to get user info
      const credential = credentialResponse.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      console.log('Decoded Google payload:', payload);

      // Automatically determine if user is admin based on email
      const isAdmin = payload.email === ADMIN_EMAIL;
      console.log('User email:', payload.email, 'Is admin:', isAdmin);

      console.log('Calling login function...');
      await login(credential, isAdmin);

      // Redirect or close modal
      if (onClose) {
        onClose();
      } else {
        window.location.href = redirectTo;
      }
    } catch (error: any) {
      console.error('Login failed with detailed error:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="w-full bg-white px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm">
            Continue with your Google account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Google Login Button */}
        <div className="mb-8">
          {isLoading ? (
            <div className="w-full py-4 px-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent mr-3"></div>
              <span className="text-indigo-700 font-medium">Signing in...</span>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-1 hover:border-indigo-300 transition-colors">
              <GoogleOAuthLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap={false}
                theme="outline"
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
              />
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            What you'll get
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              </div>
              <span className="text-sm text-gray-700">Track orders</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              </div>
              <span className="text-sm text-gray-700">Save wishlist</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              </div>
              <span className="text-sm text-gray-700">Fast checkout</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              </div>
              <span className="text-sm text-gray-700">Member offers</span>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
          <div className="flex items-start">
            <Shield className="w-4 h-4 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-xs text-gray-600 leading-relaxed">
              Secure authentication powered by Google. Your data is encrypted and protected.
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLogin;