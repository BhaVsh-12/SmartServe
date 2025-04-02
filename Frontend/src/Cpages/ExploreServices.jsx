import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowLeft,
  Search,
  AlertTriangle,
  WifiOff,
  Database,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api/capi";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={20}
          fill={index < rating ? "#FBBF24" : "transparent"}
          stroke={index < rating ? "#FBBF24" : "#D1D5DB"}
        />
      ))}
    </div>
  );
};

const ServiceCard = ({ provider, onClick, darkMode }) => {
  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-md cursor-pointer p-4`}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      onClick={onClick}
    >
      <motion.div
        className="absolute top-2 right-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } }}
      >
        {provider.availability ? (
          <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
            Available
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
            Unavailable
          </span>
        )}
      </motion.div>
      <div className="flex items-center mb-4">
        <img
          src={provider.profilePhoto}
          alt={provider.fullName}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className={darkMode ? "text-white" : "text-gray-800"}>
            {provider.fullName}
          </h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {provider.experience} years experience
          </p>
        </div>
      </div>
      <StarRating rating={provider.rating} />
      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} mt-2`}>
        {provider.description}
      </p>
      <div className={`text-sm font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
        ${provider.price}/hour
      </div>
    </motion.div>
  );
};

const ServiceCardUI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("price"); // Default sort

  const navigate = useNavigate();
  const { servicename } = useParams();
  const { darkMode } = useAppContext();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(
          `/user/api/auth/getServicemans/${servicename}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response:", response.data);
        setProviders(response.data);
        toast.success("Providers fetched successfully!");
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Failed to fetch providers.");
        toast.error("Failed to fetch providers.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [servicename]);

  const sortedProviders = [...providers].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.experience - a.experience;
      case "available":
        return a.availability ? -1 : b.availability ? 1 : 0;
      case "unavailable":
        return a.availability ? 1 : b.availability ? -1 : 0;
      default:
        return a.price - b.price;
    }
  });

  const filteredProviders = sortedProviders.filter((provider) =>
    provider.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
      <motion.button
        whileHover={{ x: -5, transition: { duration: 0.2 } }}
        className="flex items-center mb-4 text-indigo-500 hover:text-indigo-600"
        onClick={() => navigate(`/client/explore`)}
      >
        <ArrowLeft size={20} className="mr-2" /> Back
      </motion.button>

      <div className="relative mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
          className="w-full md:w-1/2 mb-4 md:mb-0"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search providers..."
            className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
              darkMode ? "bg-gray-800 text-white border-gray-600" : "border-gray-300"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
        <div className="flex items-center">
          <label htmlFor="sort" className={`mr-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`p-2 border rounded-md ${
              darkMode ? "bg-gray-800 text-white border-gray-600" : "border-gray-300"
            }`}
          >
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="experience">Experience</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading providers...</p>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8">
          <WifiOff size={60} className="text-red-500 mb-4" />
          <p className="text-lg font-semibold mb-2">Oops! Connection Failed</p>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            We're having trouble connecting. Please check your internet connection and try
            again.
          </p>
        </div>
      ) : filteredProviders.length === 0 && providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <Database size={60} className="text-yellow-500 mb-4" />
          <p className="text-lg font-semibold mb-2">No Service Providers Found</p>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Unfortunately, we don't have any service providers for {servicename} at the moment.
            It's possible that this service is not yet supported.
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => (
              <ServiceCard
                key={provider._id}
                provider={provider}
                onClick={() => navigate(`/client/provider/${servicename}/${provider._id}`)}
                darkMode={darkMode}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ServiceCardUI;