import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: 'Orders',
      question: 'How do I place an order?',
      answer: 'Browse our shop, add items to your cart, and proceed to checkout. You can pay securely using various payment methods including credit/debit cards, UPI, and digital wallets.',
    },
    {
      category: 'Orders',
      question: 'Can I modify or cancel my order?',
      answer: 'Orders can be modified or canceled within 1 hour of placement. Please contact our support team immediately at +91 8610477785 or rajarishi369@gmail.com.',
    },
    {
      category: 'Shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for select locations. You will receive tracking information once your order ships.',
    },
    {
      category: 'Shipping',
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within India. We are working on expanding our shipping options to international destinations soon.',
    },
    {
      category: 'Returns',
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for unworn, unwashed items with original tags attached. Please visit our Returns & Exchanges page for detailed information.',
    },
    {
      category: 'Returns',
      question: 'How do I initiate a return?',
      answer: 'Go to your Orders page, select the item you want to return, and click "Request Return". Our team will guide you through the process.',
    },
    {
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and popular digital wallets including Paytm, PhonePe, and Google Pay.',
    },
    {
      category: 'Payment',
      question: 'Is my payment information secure?',
      answer: 'Yes! We use industry-standard encryption and secure payment gateways to protect your financial information. We never store your complete card details.',
    },
    {
      category: 'Products',
      question: 'How do I find my size?',
      answer: 'Visit our Size Guide page for detailed measurements and fitting tips. Each product page also includes specific sizing information.',
    },
    {
      category: 'Products',
      question: 'Are the colors accurate in photos?',
      answer: 'We strive to display accurate colors, but slight variations may occur due to screen settings and lighting. Contact us if you need more details about a specific product.',
    },
  ];

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full mb-2">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or browse by category</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Still Need Help?</h2>
          <p className="text-center mb-6 text-pink-100">
            Our support team is here to assist you
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="mailto:rajarishi369@gmail.com"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">Email Us</span>
            </a>
            <a
              href="tel:+918610477785"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">Call Us</span>
            </a>
            <a
              href="https://instagram.com/style._.fitz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
