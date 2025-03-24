import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowLeft, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
      className={`rounded-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md cursor-pointer p-4`}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <img src={provider.profilePhoto} alt={provider.fullName} className="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <h3 className={darkMode ? "text-white" : "text-gray-800"}>{provider.fullName}</h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{provider.experience}years experience</p>
        </div>
      </div>
      <StarRating rating={provider.rating} />
      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} mt-2`}>{provider.description}</p>
      <div className={`text-sm font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>${provider.price}/hour</div>
    </motion.div>
  );
};

const ServiceCardUI = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { servicename } = useParams();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/user/api/auth/getServicemans/${servicename}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Console log the API response data
        setProviders(response.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setError("Failed to fetch providers.");
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchProviders();
  }, [servicename]);

  const filteredProviders = providers.filter((provider) =>
    provider.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
      <motion.button
        whileHover={{ x: -5 }}
        className="flex items-center mb-4 text-indigo-500 hover:text-indigo-600"
        onClick={() => navigate(`/client/explore`)}
      >
        <ArrowLeft size={20} className="mr-2" /> Back
      </motion.button>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search providers..."
          className={`pl-10 pr-4 py-2 w-full rounded-lg border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "border-gray-300"}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading providers...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredProviders.length > 0 ? (
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
      ) : (
        <p className="text-center text-gray-500">No providers found.</p>
      )}
    </div>
  );
};

export default ServiceCardUI;