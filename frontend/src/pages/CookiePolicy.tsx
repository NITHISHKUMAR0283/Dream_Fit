import React, { useState } from 'react';
import { Cookie, Settings, Shield, Eye, BarChart } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  });

  const handleSavePreferences = () => {
    // Save to localStorage or send to backend
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Cookie className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            This Cookie Policy explains how DreamFit uses cookies and similar tracking technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You can manage your cookie preferences at any time using the settings section below.
          </p>
        </div>

        {/* What Are Cookies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Are Cookies?</h2>

          <p className="text-gray-700 mb-4">
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your actions and preferences over time, making your browsing experience more efficient and personalized.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">First-Party Cookies</h3>
              <p className="text-sm text-gray-600">
                Set directly by DreamFit to enhance your experience on our website
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Third-Party Cookies</h3>
              <p className="text-sm text-gray-600">
                Set by external services like analytics providers and payment processors
              </p>
            </div>
          </div>
        </div>

        {/* Types of Cookies We Use */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <div className="border-l-4 border-red-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-gray-900">Necessary Cookies</h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Required:</strong> These cookies are essential for the website to function properly. They cannot be disabled.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Authentication and login sessions</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Shopping cart functionality</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Security and fraud prevention</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Load balancing and website stability</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Functional Cookies</h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Optional:</strong> These cookies enable enhanced functionality and personalization.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Remember your preferences (language, currency, etc.)</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Store your recently viewed products</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Customize your browsing experience</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Remember items in your wishlist</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <BarChart className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Analytics Cookies</h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Optional:</strong> These cookies help us understand how visitors interact with our website.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Track visitor numbers and behavior patterns</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Measure website performance and speed</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Identify popular products and pages</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Improve user experience based on data</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  <strong>Third-party services:</strong> Google Analytics, Facebook Pixel
                </p>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Marketing Cookies</h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Optional:</strong> These cookies track your online activity to provide personalized advertising.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Show relevant ads on other websites</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Measure effectiveness of advertising campaigns</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Retarget visitors with personalized offers</span>
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Track conversion rates and ROI</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  <strong>Third-party services:</strong> Google Ads, Facebook Ads, Instagram
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Preferences */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Manage Cookie Preferences</h2>
          </div>

          <p className="text-gray-700 mb-6">
            You can control which types of cookies you want to allow. Note that disabling certain cookies may affect website functionality.
          </p>

          <div className="space-y-4">
            {/* Necessary - Always on */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Necessary Cookies</h3>
                <p className="text-sm text-gray-600">Required for basic functionality</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Always Active</span>
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                <p className="text-sm text-gray-600">Enhanced features and personalization</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) =>
                    setPreferences({ ...preferences, functional: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                <p className="text-sm text-gray-600">Help us improve our website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                <p className="text-sm text-gray-600">Personalized advertising</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 peer-checked:bg-purple-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
          >
            Save Preferences
          </button>
        </div>

        {/* Managing Cookies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Cookies in Your Browser</h2>

          <p className="text-gray-700 mb-4">
            Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Google Chrome</h3>
              <p className="text-sm text-gray-600">
                Settings → Privacy and security → Cookies and other site data
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Mozilla Firefox</h3>
              <p className="text-sm text-gray-600">
                Options → Privacy & Security → Cookies and Site Data
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Safari</h3>
              <p className="text-sm text-gray-600">
                Preferences → Privacy → Manage Website Data
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Microsoft Edge</h3>
              <p className="text-sm text-gray-600">
                Settings → Cookies and site permissions → Cookies and site data
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> Blocking all cookies may prevent you from using certain features of our website, such as adding items to your cart or checking out.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
          <p className="mb-6 text-amber-100">
            If you have questions about our use of cookies, please contact us:
          </p>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> rajarishi369@gmail.com
            </p>
            <p>
              <strong>Phone:</strong> +91 8610477785
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
