import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/CUI/Button";
import api from "../Api/capi";

const HistoryPage = () => {
  const { darkMode } = useAppContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(
          "/request/api/auth/gethistory",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(response.data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={18} className="text-green-500" />;
      case "pending":
      case "pursuing":
        return <Clock size={18} className="text-yellow-500" />;
      case "declined":
        return <XCircle size={18} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return darkMode
          ? "bg-green-900/30 text-green-400"
          : "bg-green-100 text-green-800";
      case "pending":
      case "pursuing":
        return darkMode
          ? "bg-yellow-900/30 text-yellow-400"
          : "bg-yellow-100 text-yellow-800";
      case "declined":
        return darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800";
      case "cancled":
        return darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    whileHover: { scale: 1.02, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" },
    whileTap: { scale: 0.98 },
  };

  const rebookButtonVariants = {
    whileHover: {
      scale: 1.05,
      backgroundColor: darkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
    },
    whileTap: { scale: 0.95 },
  };

  const declineButtonVariants = {
    whileHover: {
      scale: 1.05,
      backgroundColor: darkMode
        ? "rgba(255, 0, 0, 0.1)"
        : "rgba(255, 0, 0, 0.05)",
    },
    whileTap: { scale: 0.95 },
  };

  const handleRebook = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/request/api/auth/rebook",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh history after rebooking
      const response = await api.get(
        "/request/api/auth/gethistory",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(response.data);
    } catch (err) {
      console.error("Error rebooking:", err);
      setError("Failed to rebook.");
    }
  };

  const handleCancel = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete("/request/api/auth/cancle", {
        headers: { Authorization: `Bearer ${token}` },
        data: { requestId },
      });
      // Refresh history after canceling
      const response = await api.get(
        "/request/api/auth/gethistory",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(response.data);
    } catch (err) {
      console.error("Error canceling:", err);
      setError("Failed to cancel.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Loading history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Service History
      </h1>
      <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        Track all your past and upcoming service requests
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
              whileHover="whileHover"
              whileTap="whileTap"
              className={`rounded-lg shadow-md overflow-hidden ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${getStatusClass(
                          item.userstatus
                        )}`}
                      >
                        {getStatusIcon(item.userstatus)}
                        <span className="ml-1">{item.userstatus}</span>
                      </span>
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className={`text-lg font-semibold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {item.service}
                    </h3>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Provider: {item.serviceman}
                    </p>
                    </div>

                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                    <span className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      ₹{item.price}
                    </span>

                    {item.userstatus === "completed" && (
                      <motion.div
                        variants={rebookButtonVariants}
                        whileHover="whileHover"
                        whileTap="whileTap"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<RotateCcw size={16} />}
                          onClick={() => handleRebook(item._id)}
                        >
                          Rebook
                        </Button>
                      </motion.div>
                    )}
                    {item.userstatus === "pending" && (
                      <motion.div
                        variants={declineButtonVariants}
                        whileHover="whileHover"
                        whileTap="whileTap"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500"
                          onClick={() => handleCancel(item._id)}
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {index < history.length - 1 && (
                  <div className="relative mt-6">
                    <div
                      className={`absolute left-6 top-0 w-0.5 h-6 ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HistoryPage;