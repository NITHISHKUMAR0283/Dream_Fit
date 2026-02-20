import React from 'react';
import { FileText, AlertTriangle, Scale, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to DreamFit! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using DreamFit, you agree to be bound by these Terms.
          </p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Please read these Terms carefully before using our services. If you do not agree to these Terms, you may not use our website or services.
              </p>
            </div>
          </div>
        </div>

        {/* Acceptance of Terms */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
          </div>

          <p className="text-gray-700 mb-4">
            By creating an account, placing an order, or using any part of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy and Cookie Policy.
          </p>
          <p className="text-gray-700">
            You must be at least 18 years old or have parental/guardian consent to use our services.
          </p>
        </div>

        {/* Account Terms */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Registration</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
              <ul className="space-y-2 ml-6">
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You must provide accurate, current, and complete information during registration</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You are responsible for maintaining the confidentiality of your account credentials</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You are responsible for all activities that occur under your account</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You must notify us immediately of any unauthorized use of your account</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Termination</h3>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activities.
              </p>
            </div>
          </div>
        </div>

        {/* Orders and Payments */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders and Payments</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Placing Orders</h3>
              <ul className="space-y-2 ml-6">
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>All orders are subject to acceptance and availability</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>We reserve the right to refuse or cancel any order for any reason</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Prices are subject to change without notice</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Product colors may vary slightly from images due to screen settings</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h3>
              <ul className="space-y-2 ml-6">
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Payment must be made in full at the time of order</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>We accept credit/debit cards, UPI, and other approved payment methods</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>All transactions are processed securely through third-party payment gateways</span>
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You are responsible for any applicable taxes and fees</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Modifications</h3>
              <p className="text-gray-700">
                Orders can be modified or canceled within 1 hour of placement. After this time, modifications may not be possible as the order enters processing.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping and Delivery</h2>

          <ul className="space-y-3">
            <li className="text-gray-700 flex items-start gap-3">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Delivery times are estimates and not guaranteed. We are not liable for delays caused by shipping carriers or circumstances beyond our control.
              </span>
            </li>
            <li className="text-gray-700 flex items-start gap-3">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                You must provide accurate shipping information. We are not responsible for orders delivered to incorrect addresses provided by you.
              </span>
            </li>
            <li className="text-gray-700 flex items-start gap-3">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Risk of loss passes to you upon delivery to the shipping carrier.
              </span>
            </li>
            <li className="text-gray-700 flex items-start gap-3">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                For more details, see our Shipping Information page.
              </span>
            </li>
          </ul>
        </div>

        {/* Returns and Refunds */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Returns and Refunds</h2>

          <p className="text-gray-700 mb-4">
            We offer a 7-day return policy for eligible items. Items must be unworn, unwashed, and have original tags attached. For complete details, please review our Returns & Exchanges page.
          </p>

          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> Certain items including undergarments, innerwear, and items marked "Final Sale" are not eligible for return.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
          </div>

          <p className="text-gray-700 mb-4">
            All content on DreamFit, including text, images, logos, designs, and software, is the property of DreamFit or its licensors and is protected by copyright, trademark, and other intellectual property laws.
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">You may not:</h3>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Reproduce, distribute, or display our content without permission</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Use our trademarks or branding without authorization</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Modify, reverse engineer, or create derivative works from our content</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Use automated systems to scrape or download our content</span>
              </li>
            </ul>
          </div>
        </div>

        {/* User Conduct */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Conduct</h2>

          <p className="text-gray-700 mb-4">You agree not to:</p>
          <ul className="space-y-2 ml-6">
            <li className="text-gray-700 flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>Violate any applicable laws or regulations</span>
            </li>
            <li className="text-gray-700 flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>Engage in fraudulent or deceptive practices</span>
            </li>
            <li className="text-gray-700 flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>Harass, abuse, or harm other users or our staff</span>
            </li>
            <li className="text-gray-700 flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>Transmit viruses, malware, or harmful code</span>
            </li>
            <li className="text-gray-700 flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>Interfere with the operation of our website or services</span>
            </li>
            <li className="text-gray-700 flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>Attempt unauthorized access to our systems</span>
            </li>
          </ul>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>

          <p className="text-gray-700 mb-4">
            To the fullest extent permitted by law, DreamFit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
          </p>
          <p className="text-gray-700">
            Our total liability for any claims arising from your use of our services shall not exceed the amount you paid to us in the 12 months preceding the claim.
          </p>
        </div>

        {/* Indemnification */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Indemnification</h2>

          <p className="text-gray-700">
            You agree to indemnify and hold harmless DreamFit, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services or violation of these Terms.
          </p>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dispute Resolution</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              Any disputes arising from these Terms or your use of our services shall be resolved through:
            </p>
            <ol className="space-y-3 ml-6">
              <li className="text-gray-700">
                <strong>1. Informal Negotiation:</strong> Contact us to attempt resolution
              </li>
              <li className="text-gray-700">
                <strong>2. Mediation:</strong> If informal resolution fails, mediation in India
              </li>
              <li className="text-gray-700">
                <strong>3. Arbitration:</strong> Binding arbitration under Indian law
              </li>
            </ol>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>

          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of India. Any legal action or proceeding shall be brought exclusively in the courts of India.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to Terms</h2>

          <p className="text-gray-700">
            We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes constitutes acceptance of the modified Terms.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="mb-6 text-blue-100">
            If you have questions or concerns about these Terms of Service, please contact us:
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

export default TermsOfService;
