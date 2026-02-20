import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Settings, Package, Phone, Mail, Instagram } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';

interface HeaderProps {
  cartItemsCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs md:text-sm">
            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="tel:+919876543210" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
                <Phone className="h-3 w-3" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:support@dreamfit.com" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
                <Mail className="h-3 w-3" />
                <span>support@dreamfit.com</span>
              </a>
            </div>

            {/* Free Shipping Text */}
            <div className="flex-1 text-center md:block hidden">
              <p>Free shipping on orders above ₹999 🎉</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <span className="hidden md:inline text-xs">Follow us</span>
              <a href="https://instagram.com/style._.fitz" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <h1 className="text-2xl font-display font-black bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-600 bg-clip-text text-transparent group-hover:animate-pulse-glow transition-all duration-300">
              DreamFit
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="relative px-4 py-2 font-heading font-semibold text-neutral-700 hover:text-primary-600 transition-all duration-300 group"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 to-secondary-100/50 rounded-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-8 transform -translate-x-1/2 transition-all duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 group-hover:text-primary-500 transition-colors duration-300 h-5 w-5 z-10" />
                <input
                  type="text"
                  placeholder="Search fitness gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl
                           focus:outline-none focus:bg-white/80 focus:border-primary-300 focus:shadow-glow
                           placeholder-neutral-500 text-neutral-800 font-medium
                           transition-all duration-300 hover:bg-white/70 hover:border-primary-200
                           group-hover:shadow-soft"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && (
              <button className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-secondary-500 transition-all duration-300 group relative rounded-full hover:bg-secondary-50">
                <Heart className="h-5 w-5 group-hover:animate-wiggle" />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-100/50 to-accent-100/50 rounded-full opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"></div>
              </button>
            )}

            <Link
              to="/cart"
              className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-primary-500 transition-all duration-300 relative group rounded-full hover:bg-primary-50"
            >
              <ShoppingCart className="h-5 w-5 group-hover:animate-bounce-in" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 to-accent-100/50 rounded-full opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"></div>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse-glow shadow-glow-orange">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* Authentication UI */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <img
                    src={user?.picture || '/api/placeholder/32/32'}
                    alt={user?.name || 'User'}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>

                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="relative px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-heading font-semibold rounded-xl
                         hover:from-primary-600 hover:to-secondary-600 hover:shadow-bold hover:scale-105
                         active:scale-95 transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden w-12 h-12 -mr-2 text-secondary-600 hover:text-primary-600 active:text-primary-700 transition-colors duration-200 flex items-center justify-center rounded-full hover:bg-primary-50"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-4 border-t">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for dresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base min-h-[48px]"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block px-4 py-4 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 active:bg-secondary-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block px-4 py-4 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 active:bg-secondary-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="block px-4 py-4 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 active:bg-secondary-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="block px-4 py-4 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 active:bg-secondary-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-4 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 active:bg-secondary-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-around py-2">
                {isAuthenticated && (
                  <button className="p-4 text-secondary-600 hover:text-primary-600 active:text-primary-700 transition-colors duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg">
                    <Heart className="h-6 w-6" />
                  </button>
                )}

                <Link
                  to="/cart"
                  className="p-4 text-secondary-600 hover:text-primary-600 active:text-primary-700 transition-colors duration-200 relative min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="p-4 text-secondary-600 hover:text-primary-600 active:text-primary-700 transition-colors duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-6 w-6" />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 font-medium min-h-[48px] text-base"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {isAuthenticated && (
                <div className="border-t pt-4 mt-4">
                  <div className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.picture || '/api/placeholder/32/32'}
                        alt={user?.name || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-base">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/orders"
                    className="block px-4 py-4 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 active:bg-secondary-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>

                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-4 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 active:bg-secondary-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-4 text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 rounded-md transition-colors duration-200 text-base font-medium min-h-[48px] flex items-center"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default Header;