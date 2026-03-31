import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  CreditCard,
  Inbox,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import api from "../Api/capi";
import { useAppContext } from "../context/AppContext";

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [token, setToken] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const { darkMode } = useAppContext();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  const fetchPayments = async () => {
    try {
      const [pendingRes, completedRes] = await Promise.all([
        api.get("/request/api/auth/pendingpayments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/request/api/auth/completedpayments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPendingPayments(pendingRes.data);
      setCompletedPayments(completedRes.data);
      setPayments([...pendingRes.data, ...completedRes.data]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch payments");
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayNow = async (payment) => {
    setProcessingId(payment._id);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const { data } = await api.post(
        "/request/api/auth/create-order",
        { requestId: payment._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "SmartServe",
        description: `Payment for ${payment.serviceman}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post(
              "/request/api/auth/verify-payment",
              {
                requestId: payment._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment successful!");
            fetchPayments();
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: () => toast.info("Payment cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not initiate payment");
    } finally {
      setProcessingId(null);
    }
  };

  const hasPayments = pendingPayments.length > 0 || completedPayments.length > 0;

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Payment Dashboard</h1>
          <p className="text-gray-600">Manage your payments and invoices in one place</p>
        </div>

        {!hasPayments ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Inbox className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Payment History</h2>
            <p className="text-gray-500 text-center">
              Once you have pending or completed payments, they will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Completed Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-2xl font-semibold">Completed Payments</h2>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {completedPayments.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-gray-500"
                    >
                      <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p>No completed payments yet</p>
                    </motion.div>
                  )}
                  {completedPayments.map((payment) => (
                    <motion.div
                      key={payment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{payment.serviceman}</p>
                        <p className="text-sm text-gray-500">
                          Paid on {format(new Date(payment.paymentAt), "MMM dd, yyyy h:mm a")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{payment.price.toFixed(2)}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Pending Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-semibold">Pending Payments</h2>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
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
                  {pendingPayments.map((payment) => (
                    <motion.div
                      key={payment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{payment.serviceman}</p>
                        <p className="text-sm text-gray-500">
                          Due on {format(new Date(payment.createdAt), "MMM dd, yyyy h:mm a")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">₹{payment.price.toFixed(2)}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={processingId === payment._id}
                          onClick={() => handlePayNow(payment)}
                          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            processingId === payment._id ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {processingId === payment._id ? "Loading..." : "Pay Now"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default PaymentPage;
