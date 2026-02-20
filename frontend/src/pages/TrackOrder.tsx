import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mockTrackingData = {
    orderId: 'DF123456789',
    currentStatus: 'In Transit',
    estimatedDelivery: 'Dec 25, 2024',
    carrier: 'DreamFit Express',
    trackingNumber: 'DFEX987654321',
    timeline: [
      {
        status: 'Delivered',
        location: 'Your Location',
        date: 'Dec 25, 2024',
        time: '02:30 PM',
        description: 'Package delivered successfully',
        completed: false,
      },
      {
        status: 'Out for Delivery',
        location: 'Local Delivery Hub',
        date: 'Dec 25, 2024',
        time: '08:00 AM',
        description: 'Package is out for delivery',
        completed: false,
      },
      {
        status: 'In Transit',
        location: 'Regional Sorting Facility',
        date: 'Dec 24, 2024',
        time: '03:45 PM',
        description: 'Package arrived at sorting facility',
        completed: true,
      },
      {
        status: 'Shipped',
        location: 'DreamFit Warehouse',
        date: 'Dec 23, 2024',
        time: '11:20 AM',
        description: 'Package shipped from warehouse',
        completed: true,
      },
      {
        status: 'Processing',
        location: 'DreamFit Warehouse',
        date: 'Dec 22, 2024',
        time: '09:15 AM',
        description: 'Order is being prepared for shipment',
        completed: true,
      },
      {
        status: 'Order Placed',
        location: 'DreamFit Store',
        date: 'Dec 21, 2024',
        time: '04:30 PM',
        description: 'Order confirmed and payment received',
        completed: true,
      },
    ],
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setTrackingData(mockTrackingData);
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-6 w-6" />;
      case 'Out for Delivery':
        return <Truck className="h-6 w-6" />;
      case 'In Transit':
        return <Truck className="h-6 w-6" />;
      case 'Shipped':
        return <Package className="h-6 w-6" />;
      case 'Processing':
        return <Clock className="h-6 w-6" />;
      case 'Order Placed':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your order ID to track your package in real-time
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleTrackOrder}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter your order ID (e.g., DF123456789)"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setError('');
                }}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have your order ID?{' '}
              <Link to="/orders" className="text-blue-600 hover:underline font-medium">
                View your orders
              </Link>
            </p>
          </div>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
                  <p className="text-lg font-semibold text-gray-900">{trackingData.orderId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tracking Number</h3>
                  <p className="text-lg font-semibold text-gray-900">{trackingData.trackingNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Current Status</h3>
                  <p className="text-lg font-semibold text-blue-600">{trackingData.currentStatus}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                  <p className="text-lg font-semibold text-gray-900">{trackingData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Tracking Timeline</h2>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline Items */}
                <div className="space-y-8">
                  {trackingData.timeline.map((item: any, index: number) => (
                    <div key={index} className="relative flex items-start gap-6">
                      {/* Icon */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.completed
                            ? 'bg-green-100 text-green-600'
                            : index === 0
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {getStatusIcon(item.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                item.completed ? 'text-gray-900' : 'text-gray-500'
                              }`}
                            >
                              {item.status}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {item.date} • {item.time}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3">Need Help?</h3>
              <p className="mb-6 text-blue-100">
                If you have questions about your order or delivery, our support team is here to help.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="mailto:rajarishi369@gmail.com"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
                >
                  <span className="font-medium">Email Support</span>
                </a>
                <a
                  href="tel:+918610477785"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
                >
                  <span className="font-medium">Call Us</span>
                </a>
                <Link
                  to="/help"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
                >
                  <span className="font-medium">Help Center</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Info Section - Only show when no tracking data */}
        {!trackingData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Find Your Order ID</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">•</span>
                <span>Check your order confirmation email sent after purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">•</span>
                <span>
                  Visit your{' '}
                  <Link to="/orders" className="text-blue-600 hover:underline font-medium">
                    Orders page
                  </Link>{' '}
                  to view all your orders
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">•</span>
                <span>Contact customer support with your registered email or phone number</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
