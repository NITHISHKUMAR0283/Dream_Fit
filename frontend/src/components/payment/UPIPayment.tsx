import React, { useState, useEffect } from 'react';
import { QrCode, Copy, CheckCircle, AlertCircle, Smartphone, ExternalLink } from 'lucide-react';

interface UPIPaymentProps {
  amount: number;
  orderNumber: string;
  onPaymentComplete: (transactionId: string) => void;
  onPaymentFailed: () => void;
  onCancel: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({
  amount,
  orderNumber,
  onPaymentComplete,
  onPaymentFailed,
  onCancel
}) => {
  const [paymentStep, setPaymentStep] = useState<'qr' | 'verify' | 'success' | 'failed'>('qr');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  const merchantUPI = 'dreamfit@paytm';
  const merchantName = 'DreamFit';

  // Generate UPI payment link
  const upiLink = `upi://pay?pa=${merchantUPI}&pn=${merchantName}&am=${amount || 0}&cu=INR&tn=Order-${orderNumber}`;

  // Countdown timer
  useEffect(() => {
    if (paymentStep === 'qr' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setPaymentStep('failed');
    }
  }, [timeRemaining, paymentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(merchantUPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransactionIdSubmit = () => {
    if (transactionId.trim()) {
      // Simulate payment verification (in real app, this would call backend)
      setTimeout(() => {
        if (transactionId.length >= 12) {
          setPaymentStep('success');
          onPaymentComplete(transactionId);
        } else {
          setPaymentStep('failed');
          onPaymentFailed();
        }
      }, 2000);
    }
  };

  const openUPIApp = (app: string) => {
    const appLinks: { [key: string]: string } = {
      'phonepe': `phonepe://pay?pa=${merchantUPI}&pn=${merchantName}&am=${amount || 0}&cu=INR&tn=Order-${orderNumber}`,
      'googlepay': `tez://upi/pay?pa=${merchantUPI}&pn=${merchantName}&am=${amount || 0}&cu=INR&tn=Order-${orderNumber}`,
      'paytm': `paytmmp://pay?pa=${merchantUPI}&pn=${merchantName}&am=${amount || 0}&cu=INR&tn=Order-${orderNumber}`,
      'bhim': `bhim://pay?pa=${merchantUPI}&pn=${merchantName}&am=${amount || 0}&cu=INR&tn=Order-${orderNumber}`
    };

    window.location.href = appLinks[app] || upiLink;
  };

  if (paymentStep === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          Transaction ID: {transactionId}
        </p>
        <p className="text-sm text-gray-500">
          Your order #{orderNumber} has been confirmed.
        </p>
      </div>
    );
  }

  if (paymentStep === 'failed') {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
        <p className="text-gray-600 mb-6">
          {timeRemaining === 0 ? 'Payment session expired.' : 'We couldn\'t verify your payment.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setPaymentStep('qr');
              setTimeRemaining(300);
              setTransactionId('');
            }}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-white text-gray-600 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'verify') {
    return (
      <div className="py-8">
        <div className="text-center mb-6">
          <Smartphone className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Payment</h3>
          <p className="text-gray-600">
            Please enter the transaction ID from your UPI app
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID / Reference Number
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter 12-digit transaction ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setPaymentStep('qr')}
              className="flex-1 bg-white text-gray-600 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleTransactionIdSubmit}
              disabled={!transactionId.trim()}
              className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300"
            >
              Verify Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-10 w-10 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay with UPI</h3>
        <p className="text-gray-600">
          Amount to pay: <span className="font-semibold">₹{amount ? amount.toLocaleString() : '0'}</span>
        </p>
        <p className="text-sm text-red-600 mt-2">
          Time remaining: {formatTime(timeRemaining)}
        </p>
      </div>

      {/* QR Code Placeholder */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-8 text-center mb-6">
        <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">QR Code for</p>
            <p className="text-sm font-medium text-gray-600">₹{amount ? amount.toLocaleString() : '0'}</p>
          </div>
        </div>
      </div>

      {/* UPI Apps */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3 text-center">
          Or pay directly through your UPI app
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => openUPIApp('phonepe')}
            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 bg-purple-600 rounded"></div>
            <span className="text-sm font-medium">PhonePe</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </button>
          <button
            onClick={() => openUPIApp('googlepay')}
            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
            <span className="text-sm font-medium">Google Pay</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </button>
          <button
            onClick={() => openUPIApp('paytm')}
            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium">Paytm</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </button>
          <button
            onClick={() => openUPIApp('bhim')}
            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 bg-orange-600 rounded"></div>
            <span className="text-sm font-medium">BHIM</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Manual UPI Details */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Manual Payment Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">UPI ID:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{merchantUPI}</span>
              <button
                onClick={copyUPIId}
                className="text-primary-600 hover:text-primary-700"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-medium">₹{amount ? amount.toLocaleString() : '0'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Reference:</span>
            <span className="text-sm font-medium">Order-{orderNumber}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setPaymentStep('verify')}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
        >
          I have made the payment
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-white text-gray-600 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel Payment
        </button>
      </div>

      {/* Payment Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Payment Instructions:</h5>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Scan the QR code or click on your UPI app</li>
          <li>Verify the amount and merchant details</li>
          <li>Complete the payment using your UPI PIN</li>
          <li>Note down the transaction ID</li>
          <li>Click "I have made the payment" and enter the transaction ID</li>
        </ol>
      </div>
    </div>
  );
};

export default UPIPayment;