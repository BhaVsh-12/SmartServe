import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import {
    CheckCircle2,
    Clock,
    DollarSign,
    CreditCard,
    X,
    Calendar,
    User,
    Lock,
    Smartphone,
    ChevronRight,
    Inbox, // Import Inbox icon
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { SiPhonepe } from "react-icons/si";
import phonepe from "../img/phonepe-icon.png";
import google from "../img/google-pay-icon.png";
import paytem from "../img/paytm-icon.png";
import api from "../Api/capi";
import { useAppContext } from "../context/AppContext";

const UPI_APPS = [
    {
        name: "Google Pay",
        icon: google,
        upiId: "@googlepay",
    },
    {
        name: "PhonePe",
        icon: phonepe,
        upiId: "@phonepe",
    },
    {
        name: "Paytm",
        icon: paytem,
        upiId: "@paytm",
    },
];

const PaymentModal = ({ payment, onClose, onSubmit, token }) => {
    const [paymentMethod, setPaymentMethod] = useState("Card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [name, setName] = useState("");
    const [upiId, setUpiId] = useState("");
    const [selectedUpiApp, setSelectedUpiApp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { darkMode } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === "Card") {
            if (!cardNumber || !expiryDate || !cvv || !name) {
                toast.error("Please fill in all card details");
                return;
            }
        } else if (paymentMethod === "UPI") {
            if (!upiId || !selectedUpiApp) {
                toast.error("Please enter UPI ID and select a payment app");
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const response = await api.put(
                "/request/api/auth/payment",
                {
                    requestId: payment._id,
                    paymentmethod: paymentMethod,
                    cardno: cardNumber.toString(),
                    upiid: upiId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Payment successful!");
            await onSubmit(payment.id);
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Payment failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${
                darkMode ? "bg-opacity-70" : ""
            }`}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`rounded-xl shadow-xl max-w-md w-full p-6 ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Payment Details</h2>
                    <button
                        onClick={onClose}
                        className={`transition-colors ${
                            darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-500"
                        }`}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="mb-6">
                    <div
                        className={`p-4 rounded-lg mb-4 ${
                            darkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                    >
                        <h3 className="font-medium">{payment.serviceman}</h3>
                        <p className="text-gray-600">Amount: ₹{payment.price.toFixed(2)}</p>
                        <p className="text-gray-600">
                            Due: {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                        </p>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setPaymentMethod("Card")}
                            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                                paymentMethod === "Card"
                                    ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-700"
                                    : `border-2 ${
                                        darkMode
                                            ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                                            : "border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`
                            }`}
                        >
                            <CreditCard className="h-5 w-5" />
                            <span>Card</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod("UPI")}
                            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                                paymentMethod === "UPI"
                                    ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-700"
                                    : `border-2 ${
                                        darkMode
                                            ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                                            : "border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`
                            }`}
                        >
                            <Smartphone className="h-5 w-5" />
                            <span>UPI</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {paymentMethod === "Card" ? (
                                <motion.div
                                    key="card-form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Card Number
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) =>
                                                    setCardNumber(
                                                        e.target.value.replace(/\D/g, "").slice(0, 16)
                                                    )
                                                }
                                                placeholder="1234 5678 9012 3456"
                                                className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                    darkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
                                                }`}
                                                maxLength={16}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Expiry Date
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                <input
                                                    type="text"
                                                    value={expiryDate}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, "");

                                                        if (value.length > 2) {
                                                            value = `<span class="math-inline">\{value\.slice\(0, 2\)\}/</span>{value.slice(
                                                                2,
                                                                4
                                                            )}`;
                                                        }

                                                        setExpiryDate(value);
                                                    }}
                                                    placeholder="MM/YY"
                                                    className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                        darkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
                                                    }`}
                                                    maxLength={5}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                CVV
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                <input
                                                    type="text"
                                                    value={cvv}
                                                    onChange={(e) =>
                                                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                                                    }
                                                    placeholder="123"
                                                    className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                        darkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
                                                    }`}
                                                    maxLength={3}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Cardholder Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                    darkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
                                                }`}
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
                                        <label className="block text-sm font-medium mb-1">
                                            UPI ID
                                        </label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="username@upi"
                                                className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                    darkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-3">
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
                                                            ? "border-indigo-500 bg-indigo-50"
                                                            : `border-gray-200 hover:bg-gray-50 ${
                                                                darkMode
                                                                    ? "border-gray-700 hover:bg-gray-700"
                                                                    : ""
                                                            }`
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={app.icon}
                                                            alt={app.name}
                                                            className="h-8 w-8"
                                                        />
                                                        <span className="font-medium">
                                                            {app.name}
                                                        </span>
                                                    </div>
                                                    <ChevronRight
                                                        className={`h-5 w-5 ${
                                                            selectedUpiApp === app.name
                                                                ? "text-indigo-500"
                                                                : "text-gray-400"
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
                                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                            type="submit"
                        >
                            {isSubmitting
                                ? "Processing..."
                                : `Pay ₹${payment.price.toFixed(2)}`}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

function App() {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [payments, setPayments] = useState([]);
    const [completedPayments, setCompletedPayments] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [token, setToken] = useState(null);
    const { darkMode } = useAppContext();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchPayments();
        }
    }, [token]);

    const fetchPayments = async () => {
        try {
            const [pendingResponse, completedResponse] = await Promise.all([
                api.get("/request/api/auth/pendingpayments", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                api.get("/request/api/auth/completedpayments", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setPendingPayments(pendingResponse.data);
            setCompletedPayments(completedResponse.data);
            setPayments([...pendingResponse.data, ...completedResponse.data]);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch payments");
        }
    };

    const handlePayment = async (paymentId) => {
        fetchPayments();
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
                    <p className="text-gray-600">
                        Manage your payments and invoices in one place
                    </p>
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
                        {/* Completed Payments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl shadow-lg p-6 ${
                                darkMode ? "bg-gray-800" : "bg-white"
                            }`}
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
                                                    Paid on {format(new Date(payment.paymentAt), "MMM dd, yyyy")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ₹{payment.price.toFixed(2)}
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
                            className={`rounded-xl shadow-lg p-6 ${
                                darkMode ? "bg-gray-800" : "bg-white"
                            }`}
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
                                                    Due on {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        ₹{payment.price.toFixed(2)}
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
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedPayment && (
                    <PaymentModal
                        payment={selectedPayment}
                        onClose={() => setSelectedPayment(null)}
                        onSubmit={handlePayment}
                        token={token}
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
                theme={darkMode ? "dark" : "light"}
            />
        </div>
    );
}

export default App;