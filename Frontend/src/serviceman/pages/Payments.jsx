import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Clock,
  Search,
  Calendar,
  Filter,
  Download,
  CreditCard,
  Smartphone,
  DollarSign,
} from 'lucide-react';
import api from "../../Api/capi";
import { useTheme } from "../hooks/useTheme";
import { FaRupeeSign } from "react-icons/fa";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const [themeClass, setThemeClass] = useState(theme);

  useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication token not found.');
          setLoading(false);
          return;
        }

        const response = await api.get('/request/api/auth/getpayments', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedPayments = response.data.map((item) => ({
          id: item._id,
          amount: item.price,
          date: new Date(item.paymentAt),
          clientname: item.clientname,
          status: item.paid === 'paid' ? 'completed' : 'pending',
          paymentMethod: item.paymentmethod?.toLowerCase(),
          cardLastFour: item.cardno ? item.cardno.toString().slice(-4) : undefined,
          upiId: item.upiid,
        }));

        setPayments(formattedPayments);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.message || 'Failed to fetch payments.');
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchPayments();
    } else {
      setLoading(false);
      setError('Please login to view payment history.');
    }
  }, []);

  const filteredPayments = payments
    .filter((payment) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && payment.status === 'completed') ||
        (filter === 'pending' && payment.status === 'pending');

      const matchesSearch =
        payment.clientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm) ||
        format(payment.date, 'MMM dd, yyyy').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = filteredPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`min-h-screen flex items-center justify-center text-red-500`}>{error}</div>;
  }

  return (
    <div className={`min-h-screen ${themeClass === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} py-4 sm:py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className={`text-2xl sm:text-3xl font-bold ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>Payment History</h1>
          <p className={`mt-2 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Track and manage all your payment transactions</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl shadow-sm p-6 transition-shadow duration-300 hover:shadow-md ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total Amount</h3>
              <FaRupeeSign className={`h-5 w-5 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
            <p className={`mt-2 text-3xl font-bold ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {totalAmount.toFixed(2)} ₹
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl shadow-sm p-6 transition-shadow duration-300 hover:shadow-md ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>Completed</h3>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedAmount.toFixed(2)} ₹
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl shadow-sm p-6 transition-shadow duration-300 hover:shadow-md ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pending</h3>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingAmount.toFixed(2)} ₹
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <Search className={`h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${themeClass === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className={`h-5 w-5 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`w-full sm:w-auto border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${themeClass === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
                >
                  <option value="all">All Payments</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className={`border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${themeClass === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  /* Implement export functionality */
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-xl shadow-sm overflow-hidden ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="min-w-full divide-y divide-gray-200">
            <div className={`px-4 sm:px-6 py-3 ${themeClass === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4">
                <div className={`col-span-4 text-left text-xs font-medium ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Transaction Details
                </div>
                <div className={`col-span-2 text-left text-xs font-medium ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Amount
                </div>
                <div className={`col-span-2 text-left text-xs font-medium ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Date
                </div>
                <div className={`col-span-2 text-left text-xs font-medium ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Payment Method
                </div>
                <div className={`col-span-2 text-left text-xs font-medium ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Status
                </div>
              </div>
            </div>

            <div className={`divide-y divide-gray-200 ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <AnimatePresence>
                {filteredPayments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                    className={`px-4 sm:px-6 py-4 ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'}`}
                  >
                    <div className="flex flex-col sm:grid sm:grid-cols-12 sm:gap-4">
                      <div className="sm:col-span-4 mb-2 sm:mb-0">
                        <div className={`text-sm font-medium ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {payment.clientname}
                        </div>
                        <div className={`text-sm ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          ID: {payment.id}
                        </div>
                      </div>
                      <div className="sm:col-span-2 mb-2 sm:mb-0">
                        <div className={`text-sm font-medium ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {payment.amount.toFixed(2)} ₹
                        </div>
                      </div>
                      <div className="sm:col-span-2 mb-2 sm:mb-0">
                        <div className={`text-sm ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {format(payment.date, 'MMM dd, yyyy')}
                        </div>
                        <div className={`text-sm ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {format(payment.date, 'hh:mm a')}
                        </div>
                      </div>
                      <div className="sm:col-span-2 mb-2 sm:mb-0">
                        <div className="flex items-center">
                          {payment.paymentMethod === 'card' ? (
                            <>
                              <CreditCard className={`h-4 w-4 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                              {payment.status === "completed" ? <span className={`text-sm ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Card {payment.cardLastFour && `****${payment.cardLastFour}`}
                              </span> : <span className={`text-sm ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>----</span>}
                            </>
                          ) : (
                            <>
                              <Smartphone className={`h-4 w-4 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                              <span className={`text-sm ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                UPI {payment.upiId && `(${payment.upiId})`}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {payment.status === 'completed' ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredPayments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`px-6 py-8 text-center ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'}`}
                >
                  <Search className={`mx-auto h-12 w-12 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                  <h3 className={`mt-2 text-sm font-medium ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>No payments found</h3>
                  <p className={`mt-1 text-sm ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentHistory;