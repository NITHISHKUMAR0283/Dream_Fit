import React, { useState } from 'react';
import { Ruler, ChevronDown, ChevronUp } from 'lucide-react';

interface SizeChart {
  category: string;
  sizes: {
    size: string;
    bust?: string;
    waist?: string;
    hip?: string;
    length?: string;
    shoulder?: string;
    chest?: string;
    inseam?: string;
  }[];
}

const SizeGuide: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string>('Tops');

  const sizeCharts: SizeChart[] = [
    {
      category: 'Tops',
      sizes: [
        { size: 'XS', bust: '30-32"', waist: '24-26"', shoulder: '13"', length: '23"' },
        { size: 'S', bust: '32-34"', waist: '26-28"', shoulder: '14"', length: '24"' },
        { size: 'M', bust: '34-36"', waist: '28-30"', shoulder: '15"', length: '25"' },
        { size: 'L', bust: '36-38"', waist: '30-32"', shoulder: '16"', length: '26"' },
        { size: 'XL', bust: '38-40"', waist: '32-34"', shoulder: '17"', length: '27"' },
        { size: 'XXL', bust: '40-42"', waist: '34-36"', shoulder: '18"', length: '28"' },
      ],
    },
    {
      category: 'Dresses',
      sizes: [
        { size: 'XS', bust: '30-32"', waist: '24-26"', hip: '34-36"', length: '36"' },
        { size: 'S', bust: '32-34"', waist: '26-28"', hip: '36-38"', length: '37"' },
        { size: 'M', bust: '34-36"', waist: '28-30"', hip: '38-40"', length: '38"' },
        { size: 'L', bust: '36-38"', waist: '30-32"', hip: '40-42"', length: '39"' },
        { size: 'XL', bust: '38-40"', waist: '32-34"', hip: '42-44"', length: '40"' },
        { size: 'XXL', bust: '40-42"', waist: '34-36"', hip: '44-46"', length: '41"' },
      ],
    },
    {
      category: 'Bottoms',
      sizes: [
        { size: 'XS', waist: '24-26"', hip: '34-36"', inseam: '28"', length: '38"' },
        { size: 'S', waist: '26-28"', hip: '36-38"', inseam: '29"', length: '39"' },
        { size: 'M', waist: '28-30"', hip: '38-40"', inseam: '30"', length: '40"' },
        { size: 'L', waist: '30-32"', hip: '40-42"', inseam: '31"', length: '41"' },
        { size: 'XL', waist: '32-34"', hip: '42-44"', inseam: '32"', length: '42"' },
        { size: 'XXL', waist: '34-36"', hip: '44-46"', inseam: '33"', length: '43"' },
      ],
    },
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? '' : category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <Ruler className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Size Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive sizing charts
          </p>
        </div>

        {/* How to Measure Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-pink-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">Bust</h3>
              <p className="text-sm text-gray-600">
                Measure around the fullest part of your bust, keeping the tape parallel to the floor
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-pink-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900">Waist</h3>
              <p className="text-sm text-gray-600">
                Measure around your natural waistline, the narrowest part of your torso
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-pink-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900">Hip</h3>
              <p className="text-sm text-gray-600">
                Measure around the fullest part of your hips, approximately 8 inches below your waist
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-pink-600 font-bold text-lg">4</span>
              </div>
              <h3 className="font-semibold text-gray-900">Length</h3>
              <p className="text-sm text-gray-600">
                For tops: shoulder to hem. For bottoms: waist to hem
              </p>
            </div>
          </div>
        </div>

        {/* Size Charts */}
        <div className="space-y-4">
          {sizeCharts.map((chart) => (
            <div
              key={chart.category}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(chart.category)}
                className="w-full px-8 py-6 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-colors"
              >
                <h3 className="text-2xl font-bold text-gray-900">{chart.category}</h3>
                {expandedCategory === chart.category ? (
                  <ChevronUp className="h-6 w-6 text-gray-600" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-600" />
                )}
              </button>

              {expandedCategory === chart.category && (
                <div className="p-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-pink-200">
                          <th className="text-left py-4 px-4 font-semibold text-gray-900">Size</th>
                          {chart.sizes[0].bust && <th className="text-left py-4 px-4 font-semibold text-gray-900">Bust</th>}
                          {chart.sizes[0].waist && <th className="text-left py-4 px-4 font-semibold text-gray-900">Waist</th>}
                          {chart.sizes[0].hip && <th className="text-left py-4 px-4 font-semibold text-gray-900">Hip</th>}
                          {chart.sizes[0].shoulder && <th className="text-left py-4 px-4 font-semibold text-gray-900">Shoulder</th>}
                          {chart.sizes[0].inseam && <th className="text-left py-4 px-4 font-semibold text-gray-900">Inseam</th>}
                          {chart.sizes[0].length && <th className="text-left py-4 px-4 font-semibold text-gray-900">Length</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {chart.sizes.map((size, index) => (
                          <tr
                            key={size.size}
                            className={`border-b border-gray-100 ${
                              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            } hover:bg-pink-50 transition-colors`}
                          >
                            <td className="py-4 px-4 font-semibold text-pink-600">{size.size}</td>
                            {size.bust && <td className="py-4 px-4 text-gray-700">{size.bust}</td>}
                            {size.waist && <td className="py-4 px-4 text-gray-700">{size.waist}</td>}
                            {size.hip && <td className="py-4 px-4 text-gray-700">{size.hip}</td>}
                            {size.shoulder && <td className="py-4 px-4 text-gray-700">{size.shoulder}</td>}
                            {size.inseam && <td className="py-4 px-4 text-gray-700">{size.inseam}</td>}
                            {size.length && <td className="py-4 px-4 text-gray-700">{size.length}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fitting Tips */}
        <div className="mt-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Fitting Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Between Sizes?</h3>
              <p className="text-pink-100">
                If your measurements fall between two sizes, we recommend sizing up for a more comfortable fit, or sizing down for a more fitted look.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fabric Matters</h3>
              <p className="text-pink-100">
                Stretchy fabrics like jersey or spandex blends offer more flexibility in sizing. Non-stretch fabrics require more precise measurements.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Check Product Details</h3>
              <p className="text-pink-100">
                Each product page includes specific fit information and customer reviews about sizing. Read them before ordering!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Still Unsure?</h3>
              <p className="text-pink-100">
                Contact our customer service team at +91 8610477785 or rajarishi369@gmail.com for personalized sizing assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
