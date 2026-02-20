import React from 'react';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            At DreamFit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using DreamFit, you agree to the collection and use of information in accordance with this policy. If you do not agree with this policy, please do not use our services.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-2">When you create an account or place an order, we collect:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Name and contact information (email, phone number)</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Billing and shipping addresses</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Payment information (processed securely by third-party providers)</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Order history and preferences</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-700 mb-2">When you visit our website, we automatically collect:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>IP address and browser type</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Device information and operating system</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Browsing behavior and pages visited</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Cookies and similar tracking technologies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>

          <p className="text-gray-700 mb-4">We use the collected information for various purposes:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                <strong>Order Processing:</strong> To process and fulfill your orders, including shipping and payment processing
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                <strong>Customer Service:</strong> To respond to inquiries, provide support, and handle returns/exchanges
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                <strong>Account Management:</strong> To create and maintain your account and preferences
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                <strong>Marketing:</strong> To send promotional emails and personalized recommendations (with your consent)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                <strong>Analytics:</strong> To analyze website usage and improve our services
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                <strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents
              </span>
            </li>
          </ul>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
          </div>

          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
              <p className="text-sm text-gray-600">
                All sensitive data is encrypted using industry-standard SSL/TLS protocols
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-sm text-gray-600">
                Data is stored on secure servers with restricted access
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Access Control</h3>
              <p className="text-sm text-gray-600">
                Limited employee access with authentication requirements
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Regular Audits</h3>
              <p className="text-sm text-gray-600">
                Periodic security assessments and vulnerability testing
              </p>
            </div>
          </div>
        </div>

        {/* Sharing Your Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sharing Your Information</h2>

          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">•</span>
              <span className="text-gray-700">
                <strong>Service Providers:</strong> Payment processors, shipping companies, and analytics providers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">•</span>
              <span className="text-gray-700">
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">•</span>
              <span className="text-gray-700">
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
              </span>
            </li>
          </ul>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h2>

          <p className="text-gray-700 mb-4">You have the right to:</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Access</h3>
              <p className="text-sm text-gray-600">Request a copy of your personal information</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Correction</h3>
              <p className="text-sm text-gray-600">Update or correct inaccurate information</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Deletion</h3>
              <p className="text-sm text-gray-600">Request deletion of your personal data (subject to legal obligations)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Opt-Out</h3>
              <p className="text-sm text-gray-600">Unsubscribe from marketing communications</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Data Portability</h3>
              <p className="text-sm text-gray-600">Receive your data in a machine-readable format</p>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies and Tracking</h2>

          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to enhance your experience. You can manage cookie preferences through your browser settings. For more details, see our Cookie Policy.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h2>

          <p className="text-gray-700">
            DreamFit is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>

          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Contact Us</h2>
          </div>
          <p className="mb-6 text-purple-100">
            If you have questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> rajarishi369@gmail.com
            </p>
            <p>
              <strong>Phone:</strong> +91 8610477785
            </p>
            <p>
              <strong>Address:</strong> Style._.fitz, Chennai, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
