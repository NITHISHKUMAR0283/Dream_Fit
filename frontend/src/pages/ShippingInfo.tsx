import React from 'react';
import { Truck, Package, Clock, MapPin, Shield, IndianRupee } from 'lucide-react';

const ShippingInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable delivery across India with real-time tracking
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Standard Shipping</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">5-7 Business Days</span>
              </div>
              <div className="flex items-center gap-3">
                <IndianRupee className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">₹50 (Free on orders over ₹999)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Available across India</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Best for:</strong> Regular orders where timing is flexible
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100 hover:border-purple-300 transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Express Shipping</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">2-3 Business Days</span>
              </div>
              <div className="flex items-center gap-3">
                <IndianRupee className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">₹150 (Free on orders over ₹2999)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Select metro cities</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-900">
                <strong>Best for:</strong> Urgent orders and special occasions
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Process */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Shipping Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-pink-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Placed</h3>
              <p className="text-sm text-gray-600">
                You place your order and receive a confirmation email immediately
              </p>
              {/* Connecting line */}
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-pink-200 to-blue-200"></div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing</h3>
              <p className="text-sm text-gray-600">
                We carefully pack your items within 1-2 business days
              </p>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipped</h3>
              <p className="text-sm text-gray-600">
                Your order ships and you receive tracking details via email
              </p>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-purple-200 to-green-200"></div>
            </div>

            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivered</h3>
              <p className="text-sm text-gray-600">
                Your package arrives at your doorstep. Enjoy your new clothes!
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Zones & Timelines</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Zone</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Areas Covered</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Standard</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Express</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-blue-600">Zone 1</td>
                  <td className="py-4 px-4 text-gray-700">Delhi NCR, Mumbai, Bangalore, Hyderabad</td>
                  <td className="py-4 px-4 text-gray-700">4-5 days</td>
                  <td className="py-4 px-4 text-gray-700">2-3 days</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-blue-600">Zone 2</td>
                  <td className="py-4 px-4 text-gray-700">Pune, Chennai, Kolkata, Ahmedabad, Jaipur</td>
                  <td className="py-4 px-4 text-gray-700">5-6 days</td>
                  <td className="py-4 px-4 text-gray-700">3-4 days</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-blue-600">Zone 3</td>
                  <td className="py-4 px-4 text-gray-700">Other major cities</td>
                  <td className="py-4 px-4 text-gray-700">6-7 days</td>
                  <td className="py-4 px-4 text-gray-700">Not available</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-blue-600">Zone 4</td>
                  <td className="py-4 px-4 text-gray-700">Remote areas</td>
                  <td className="py-4 px-4 text-gray-700">7-10 days</td>
                  <td className="py-4 px-4 text-gray-700">Not available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Secure Packaging</h2>
            </div>
            <p className="text-gray-600 mb-4">
              All orders are carefully packaged to ensure your items arrive in perfect condition. We use eco-friendly materials whenever possible.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Tamper-proof packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Weather-resistant materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Eco-friendly packing materials</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Order Tracking</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Track your order every step of the way with real-time updates via SMS and email. View detailed tracking info on your Orders page.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>Real-time tracking updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>SMS & email notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>Estimated delivery dates</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
              <p className="text-blue-100">
                Currently, we only ship within India. We're working on expanding to international shipping soon!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I change my shipping address after ordering?</h3>
              <p className="text-blue-100">
                Yes, if your order hasn't shipped yet. Contact us immediately at +91 8610477785 or rajarishi369@gmail.com.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What if I'm not home for delivery?</h3>
              <p className="text-blue-100">
                Our courier partner will attempt delivery 2-3 times. You can also reschedule delivery or pick up from the nearest courier center.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Are there any hidden charges?</h3>
              <p className="text-blue-100">
                No! The shipping cost shown at checkout is final. No additional charges will be applied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
