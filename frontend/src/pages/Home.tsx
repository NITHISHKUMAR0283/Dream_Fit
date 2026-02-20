import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RotateCcw, Heart, Sparkles, ShoppingBag, TrendingUp, Award, Upload, Edit2, Plus, X, Save, Trash2, Settings } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import ScrollReveal from '../components/common/ScrollReveal';
import ParticleField from '../components/three/ParticleField';
import Card3D from '../components/three/Card3D';
import FloatingShapes from '../components/three/FloatingShapes';
import Testimonials from '../components/home/Testimonials';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  image: string;
  count: string;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop&q=80');
  const [showHeroUpload, setShowHeroUpload] = useState(false);
  const [heroUploadLoading, setHeroUploadLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [productTabs, setProductTabs] = useState<Array<{ id: string; tab_id: string; label: string; display_order: number }>>([]);
  const [showTabsModal, setShowTabsModal] = useState(false);
  const [editingTab, setEditingTab] = useState<any>(null);
  const [tabFormData, setTabFormData] = useState({ tab_id: '', label: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addItem } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Load products, categories, hero image, and tabs from API
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadHeroImage();
    loadProductTabs();
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = () => {
    // Check if user has already subscribed (stored in localStorage)
    const subscribed = localStorage.getItem('newsletter_subscribed');
    if (subscribed === 'true') {
      setIsSubscribed(true);
    }
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      // Fetch featured products
      const featuredResponse = await fetch('/api/products/featured');
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();
        if (featuredData.success && featuredData.data?.products) {
          const convertedFeatured: Product[] = featuredData.data.products.map((product: any) => ({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: Math.round(product.price * 100),
            discountPrice: product.discountPrice ? Math.round(product.discountPrice * 100) : undefined,
            images: product.images,
            category: product.category,
            sizes: product.sizes,
            colors: product.colors,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
            featured: product.featured,
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
            tags: product.tags || [],
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          }));
          setFeaturedProducts(convertedFeatured);
        }
      }

      // Fetch all products for new arrivals
      const allResponse = await fetch('/api/products?limit=4');
      if (allResponse.ok) {
        const allData = await allResponse.json();
        if (allData.success && allData.data?.products) {
          const convertedArrivals: Product[] = allData.data.products.map((product: any) => ({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: Math.round(product.price * 100),
            discountPrice: product.discountPrice ? Math.round(product.discountPrice * 100) : undefined,
            images: product.images,
            category: product.category,
            sizes: product.sizes,
            colors: product.colors,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
            featured: product.featured,
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
            tags: product.tags || [],
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          }));
          setNewArrivals(convertedArrivals);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const result = await response.json();

      if (result.success && result.data) {
        // Filter only categories marked to show on home page
        const homeCategories = result.data
          .filter((cat: any) => cat.show_on_home)
          .sort((a: any, b: any) => (a.home_order || 0) - (b.home_order || 0))
          .map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            image: cat.image || '/api/placeholder/400/500',
            count: '0', // Can be updated with actual product count if needed
          }));

        setCategories(homeCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to empty array if API fails
      setCategories([]);
    }
  };

  const loadHeroImage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hero-images/active');
      const result = await response.json();

      if (result.success && result.data && result.data.image_url) {
        setHeroImage(result.data.image_url);
      }
    } catch (error) {
      console.error('Error loading hero image:', error);
    }
  };

  const handleHeroImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      await uploadHeroImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const uploadHeroImage = async (imageData: string) => {
    setHeroUploadLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/hero-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          title: 'Hero Image',
          subtitle: 'Fashion Collection',
          position: 'main'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setHeroImage(result.data.image_url);
        setShowHeroUpload(false);
        alert('Hero image updated successfully!');
      } else {
        alert(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
      alert('Failed to upload image. Check console for details.');
    } finally {
      setHeroUploadLoading(false);
    }
  };

  // Product Tabs Management Functions
  const loadProductTabs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/product-tabs');
      const result = await response.json();

      if (result.success) {
        setProductTabs(result.data);
      }
    } catch (error) {
      console.error('Error loading product tabs:', error);
      // Fallback to default tabs if API fails
      setProductTabs([
        { id: '1', tab_id: 'all', label: 'All Products', display_order: 1 },
        { id: '2', tab_id: 'dresses', label: 'Dresses', display_order: 2 },
        { id: '3', tab_id: 'tops', label: 'Tops & Tees', display_order: 3 },
        { id: '4', tab_id: 'bottoms', label: 'Bottoms', display_order: 4 },
        { id: '5', tab_id: 'accessories', label: 'Accessories', display_order: 5 }
      ]);
    }
  };

  const handleOpenTabModal = (tab?: any) => {
    if (tab) {
      setEditingTab(tab);
      setTabFormData({ tab_id: tab.tab_id, label: tab.label });
    } else {
      setEditingTab(null);
      setTabFormData({ tab_id: '', label: '' });
    }
    setShowTabsModal(true);
  };

  const handleCloseTabModal = () => {
    setShowTabsModal(false);
    setEditingTab(null);
    setTabFormData({ tab_id: '', label: '' });
  };

  const handleSaveTab = async () => {
    try {
      const url = editingTab
        ? `http://localhost:5000/api/product-tabs/${editingTab.id}`
        : 'http://localhost:5000/api/product-tabs';

      const response = await fetch(url, {
        method: editingTab ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab_id: tabFormData.tab_id,
          label: tabFormData.label,
          displayOrder: editingTab?.display_order || productTabs.length + 1,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await loadProductTabs();
        alert(editingTab ? 'Tab updated!' : 'Tab added!');
        handleCloseTabModal();
      } else {
        alert(result.message || 'Failed to save tab');
      }
    } catch (error) {
      console.error('Error saving tab:', error);
      alert('Failed to save tab');
    }
  };

  const handleDeleteTab = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}" tab?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/product-tabs/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await loadProductTabs();
        alert('Tab deleted!');
      } else {
        alert(result.message || 'Failed to delete tab');
      }
    } catch (error) {
      console.error('Error deleting tab:', error);
      alert('Failed to delete tab');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeError('');
    setSubscribeSuccess(false);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('newsletter_subscribed', 'true');
        setIsSubscribed(true);
        setSubscribeSuccess(true);
        setEmail('');
        setPhone('');
      } else {
        setSubscribeError(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setSubscribeError('Network error. Please try again.');
      console.error('Subscription error:', error);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹999',
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '7-day hassle-free returns',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Quality Assured',
      description: 'Premium fabric & stitching',
      color: 'from-rose-400 to-pink-500'
    },
  ];

  return (
    <div className="bg-gradient-to-b from-pink-50/50 via-white to-purple-50/30">

      {/* Hero Section - Elegant & Feminine */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden mb-16">
        {/* Background with soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100"></div>

        {/* 3D Particle Field Background */}
        <ParticleField opacity={0.6} />

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-semibold text-gray-700">New Collection 2025</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                <span className="block text-gray-900 mb-2">Discover Your</span>
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Embrace elegance with our curated collection of women's fashion.
                From casual chic to evening glamour, find pieces that celebrate you.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Browse Collections
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-8 justify-center lg:justify-start pt-4">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-pink-600">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">Happy Customers</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">Products</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-rose-600">4.9⭐</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image Showcase */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 group">
                <img
                  src={heroImage}
                  alt="Fashion model"
                  className="rounded-3xl shadow-2xl w-full h-auto object-cover"
                  style={{ maxHeight: '700px' }}
                />

                {/* Admin Edit Button */}
                {isAdmin && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={heroUploadLoading}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                    title="Change hero image"
                  >
                    {heroUploadLoading ? (
                      <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Edit2 className="w-5 h-5" />
                    )}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageSelect}
                  className="hidden"
                />

                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Trending Now</div>
                      <div className="text-sm text-gray-600">Latest Arrivals</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Explore our diverse collection tailored for every occasion
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <ScrollReveal key={index} delay={index * 100} duration={500}>
                <Card3D className="h-full" intensity={15}>
                  <Link
                    to={`/shop?category=${category.name.toLowerCase()}`}
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block h-full"
                  >
                    <div className="aspect-[3/4] relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                        <p className="text-sm text-white/80">{category.count} Items</p>
                      </div>
                    </div>
                  </Link>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 75} duration={400} direction="up">
                <Card3D intensity={10}>
                  <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with Tabs */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-10">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
                  Best Selling Items
                </h2>
                <p className="text-base sm:text-lg text-gray-600">
                  Handpicked favorites just for you
                </p>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {productTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-6 py-2.5 font-semibold text-sm rounded-full transition-all duration-300 whitespace-nowrap ${
                      selectedTab === tab.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <ScrollReveal key={product._id} delay={index * 100} duration={500}>
                  <ProductCard
                    product={product}
                    onQuickView={handleQuickView}
                    onAddToCart={(productId, size, color) => {
                      addItem(product, 1, size, color);
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-10">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-12 sm:py-16 bg-gradient-to-b from-purple-50/50 to-pink-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm mb-3">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-semibold text-gray-700">Just Arrived</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-3">
                New Arrivals
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Be the first to style the latest trends
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product, index) => (
                <ScrollReveal key={product._id} delay={index * 100} duration={500}>
                  <ProductCard
                    product={product}
                    onQuickView={handleQuickView}
                    onAddToCart={(productId, size, color) => {
                      addItem(product, 1, size, color);
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter - Hidden after subscription */}
      {!isSubscribed && (
        <section className="py-12 sm:py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
              <Award className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Join Our Style Community
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Subscribe for exclusive offers, style tips, and early access to new collections
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={subscribeLoading}
                    className="flex-1 px-6 py-3 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg disabled:opacity-50"
                    style={{ minHeight: '48px', height: 'auto' }}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    required
                    disabled={subscribeLoading}
                    className="flex-1 px-6 py-3 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg disabled:opacity-50"
                    style={{ minHeight: '48px', height: 'auto' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribeLoading || !email || !phone}
                  className="w-full px-8 py-3 bg-white text-pink-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ minHeight: '48px', height: 'auto' }}
                >
                  {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {subscribeError && (
                <p className="text-sm text-red-200 mt-4 bg-red-500/20 px-4 py-2 rounded-full inline-block">
                  {subscribeError}
                </p>
              )}

              {!subscribeError && (
                <p className="text-sm text-white/70 mt-4">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={() => {
            setIsQuickViewOpen(false);
            setQuickViewProduct(null);
          }}
          onAddToCart={(productId: string, size: string, color: string) => {
            addItem(quickViewProduct, 1, size, color);
          }}
        />
      )}

    </div>
  );
};

export default Home;
