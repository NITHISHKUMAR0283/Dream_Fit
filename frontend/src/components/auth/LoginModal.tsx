import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import GoogleLogin from './GoogleLogin';
import SimpleLogin from './SimpleLogin';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose
}) => {
  const [useGoogleLogin, setUseGoogleLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto" style={{ zIndex: 99999 }}>
      {/* Backdrop with animation */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 99998 }}
      />

      {/* Modal Content with animation - Using flex min-h-full for proper centering */}
      <div className="flex min-h-full items-center justify-center p-4" style={{ position: 'relative', zIndex: 99999 }}>
        <div
          className={`relative w-full max-w-md my-8 transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{ zIndex: 99999 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ position: 'relative', zIndex: 99999 }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 min-h-0"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Login Method Toggle - Modern Design */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Welcome Back</h2>
            <div className="flex gap-2 p-1.5 bg-white rounded-xl shadow-sm">
              <button
                onClick={() => setUseGoogleLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 min-h-0 ${
                  useGoogleLogin
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Google Login
              </button>
              <button
                onClick={() => setUseGoogleLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 min-h-0 ${
                  !useGoogleLogin
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Demo Login
              </button>
            </div>
          </div>

          {/* Login Component Container */}
          <div>
            {useGoogleLogin ? (
              <GoogleLogin onClose={onClose} />
            ) : (
              <SimpleLogin onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
    </div>,
    document.body
  );
};

export default LoginModal;