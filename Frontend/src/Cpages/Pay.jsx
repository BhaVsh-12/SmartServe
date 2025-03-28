import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';
import { CheckCircle2, Clock, DollarSign, CreditCard, X, Calendar, User, Lock, Smartphone, ChevronRight } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const UPI_APPS = [
  {
    name: 'Google Pay',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Google_Pay_Logo.svg',
    upiId: '@googlepay'
  },
  {
    name: 'PhonePe',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/58/PhonePe_logo.svg',
    upiId: '@phonepe'
  },
  {
    name: 'Paytm',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png',
    upiId: '@paytm'
  }
];

const PaymentModal = ({ payment, onClose, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !name) {
        toast.error('Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !selectedUpiApp) {
        toast.error('Please enter UPI ID and select a payment app');
        return;
      }
    }

    setIsSubmitting(true);
    await onSubmit(payment.id);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-gray-900">{payment.description}</h3>
            <p className="text-gray-600">Amount: ${payment.amount.toFixed(2)}</p>
            <p className="text-gray-600">Due: {format(payment.date, 'MMM dd, yyyy')}</p>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                paymentMethod === 'card'
                  ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                paymentMethod === 'upi'
                  ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Smartphone className="h-5 w-5" />
              <span>UPI</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {paymentMethod === 'card' ? (
                <motion.div
                  key="card-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="1234 5678 9012 3456"
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        maxLength={16}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 2) {
                              setExpiryDate(value);
                            } else {
                              setExpiryDate(`<span class="math-inline">\{value\.slice\(0, 2\)\}/</span>{value.slice(2, 4)}`);
                            }
                          }}
                          placeholder="MM/YY"
                          className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          maxLength={5}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          maxLength={3}
                        />
                      </div>
                      </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upi-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Payment App
                    </label>
                    <div className="space-y-2">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.name}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 ${
                            selectedUpiApp === app.name
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img src={app.icon} alt={app.name} className="h-8 w-8" />
                            <span className="font-medium text-gray-900">{app.name}</span>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 ${
                              selectedUpiApp === app.name ? 'text-indigo-500' : 'text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              type="submit"
            >
              {isSubmitting ? 'Processing...' : `Pay $${payment.amount.toFixed(2)}`}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payments, setPayments] = useState([
    {
      id: '1',
      amount: 299.99,
      date: new Date(2024, 1, 15),
      description: 'Premium Subscription',
      status: 'completed'
    },
    {
      id: '2',
      amount: 149.50,
      date: new Date(2024, 1, 20),
      description: 'Software License',
      status: 'completed'
    },
    {
      id: '3',
      amount: 499.99,
      date: new Date(2024, 2, 1),
      description: 'Consulting Services',
      status: 'pending'
    },
    {
      id: '4',
      amount: 79.99,
      date: new Date(2024, 2, 5),
      description: 'Monthly Support',
      status: 'pending'
    }
  ]);

  const handlePayment = async (paymentId) => {
    toast.info('Processing payment...', { autoClose: 2000 });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status: 'completed', date: new Date() }
            : payment
        )
      );

      toast.success('Payment successful!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const completedPayments = payments.filter((p) => p.status === 'completed');
  const pendingPayments = payments.filter((p) => p.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Dashboard</h1>
          <p className="text-gray-600">Manage your payments and invoices in one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Completed Payments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Completed Payments</h2>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {completedPayments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-500">
                        {format(payment.date, 'MMM dd, যশোরে')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* PendingPayments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Pending Payments</h2>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {pendingPayments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-500">
                        Due: {format(payment.date, 'MMM dd, যশোরে')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {pendingPayments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p>No pending payments</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedPayment && (
          <PaymentModal
            payment={selectedPayment}
            onClose={() => setSelectedPayment(null)}
            onSubmit={handlePayment}
          />
        )}
      </AnimatePresence>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;