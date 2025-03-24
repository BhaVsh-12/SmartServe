import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/CUI/Button";

const PaymentPage = () => {
  const { user, transactions, darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState("methods");

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Pending":
        return <Clock size={16} className="text-yellow-500" />;
      case "Failed":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800";
      case "Pending":
        return darkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-800";
      case "Failed":
        return darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Payment
      </h1>
      <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        Manage your payment methods and view transaction history
      </p>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "methods"
              ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}`
              : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
          }`}
          onClick={() => setActiveTab("methods")}
        >
          Payment Methods
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "transactions"
              ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}`
              : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          Transaction History
        </button>
      </div>

      {/* Payment Methods Tab */}
      {activeTab === "methods" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {user.paymentMethods.map((method) => (
            <motion.div key={method.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <CreditCard size={24} className={darkMode ? "text-indigo-400" : "text-indigo-600"} />
                  </div>
                  <div className="ml-4">
                    <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {method.type} {method.lastFour && `ending in ${method.lastFour}`}
                    </h3>
                    {method.expiryDate && (
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Expires: {method.expiryDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {method.isDefault && (
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-3 ${darkMode ? "bg-indigo-900 text-indigo-300" : "bg-indigo-100 text-indigo-800"}`}>
                      Default
                    </span>
                  )}
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Payment Method */}
          <motion.div className={`rounded-lg border-2 border-dashed ${darkMode ? "border-gray-700" : "border-gray-300"} p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200`}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <Plus size={24} className={darkMode ? "text-indigo-400" : "text-indigo-600"} />
              </div>
              <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                Add Payment Method
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Add a new credit card or payment account
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Transaction History Tab */}
      {activeTab === "transactions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {transactions.map((transaction) => (
            <motion.div key={transaction.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${getStatusClass(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{transaction.status}</span>
                    </span>
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {transaction.date}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {transaction.description}
                  </h3>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {transaction.amount}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PaymentPage;
