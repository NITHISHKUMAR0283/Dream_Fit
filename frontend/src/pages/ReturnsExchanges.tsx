import React from 'react';
import { RotateCcw, Package, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnsExchanges: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <RotateCcw className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Easy returns and hassle-free exchanges within 7 days
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Return Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">7-Day Window</h3>
              <p className="text-sm text-gray-600">
                Return or exchange items within 7 days of delivery
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Pickup</h3>
              <p className="text-sm text-gray-600">
                We'll arrange free pickup from your location
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Refunds</h3>
              <p className="text-sm text-gray-600">
                Refunds processed within 5-7 business days
              </p>
            </div>
          </div>
        </div>

        {/* Eligible vs Non-Eligible Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Eligible for Return</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Items with original tags attached</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Unworn and unwashed items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Products in original packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Defective or damaged items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Wrong items delivered</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Items with size or fit issues</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Not Eligible for Return</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span className="text-gray-700">Items without original tags</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span className="text-gray-700">Worn or washed items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span className="text-gray-700">Undergarments and innerwear</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span className="text-gray-700">Sale items marked "Final Sale"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span className="text-gray-700">Items damaged by customer misuse</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span className="text-gray-700">Returns after 7-day window</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Initiate a Return</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-pink-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Orders Page</h3>
              <p className="text-sm text-gray-600">
                Log in and go to your <Link to="/orders" className="text-pink-600 hover:underline">Orders page</Link>
              </p>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-pink-200 to-blue-200"></div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Select Item</h3>
              <p className="text-sm text-gray-600">
                Choose the item you want to return and click "Request Return"
              </p>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Reason</h3>
              <p className="text-sm text-gray-600">
                Select the reason for return and provide any additional details
              </p>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gradient-to-r from-purple-200 to-green-200"></div>
            </div>

            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Schedule Pickup</h3>
              <p className="text-sm text-gray-600">
                We'll arrange a free pickup from your location within 2-3 days
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Process */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchange Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Initiate Exchange</h3>
                <p className="text-gray-600">
                  Follow the same process as returns, but select "Exchange" instead of "Return" and choose your preferred replacement item (size, color, or different product).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Pickup & Verification</h3>
                <p className="text-gray-600">
                  We'll pick up the item and verify its condition. Once approved, your exchange item will be shipped immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Receive New Item</h3>
                <p className="text-gray-600">
                  Your exchange item will be delivered within 5-7 business days. No additional shipping charges for exchanges!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> If the exchange item has a price difference, you'll need to pay the additional amount or receive a refund for the difference.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Item picked up and received at warehouse: 2-3 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Quality check and verification: 1-2 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Refund initiated: Within 24 hours of approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Refund credited to your account: 5-7 business days</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Refund Methods</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Original payment method (credit/debit card, UPI, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Store credit (instant credit to your DreamFit account)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Bank transfer (for cash on delivery orders)</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-900">
                  <strong>Store Credit Bonus:</strong> Choose store credit and get an instant refund + 5% bonus credit!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Help with Returns?</h2>
          <p className="mb-6 text-green-100">
            Our customer support team is here to assist you with any return or exchange queries.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="mailto:rajarishi369@gmail.com"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
            >
              <span className="font-medium">Email: rajarishi369@gmail.com</span>
            </a>
            <a
              href="tel:+918610477785"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
            >
              <span className="font-medium">Call: +91 8610477785</span>
            </a>
            <Link
              to="/help"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
            >
              <span className="font-medium">Visit Help Center</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
