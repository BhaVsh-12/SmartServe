import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  MessageSquare,
  Phone,
  Calendar,
  Star,
  Clock,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import StarRating from "../components/CUI/StarRating";
import Button from "../components/CUI/Button";
import api from "../Api/capi";

const ProviderDetailPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useAppContext() || {};

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/user/api/auth/getServiceman/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Provider Data:", response.data);
        setProvider(response.data);
      } catch (err) {
        console.error("Error fetching provider:", err);
        setError("Failed to load provider details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/user/api/auth/getreviews/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Reviews Data:", response.data);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchProvider();
    fetchReviews();
  }, [providerId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Provider not found</h2>
        <Button onClick={() => navigate?.("/")}>Back to Explore</Button>
      </div>
    );
  }

  const handleBook = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/request/api/auth/create",
        { servicemanId: providerId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Request Response:", response.data);
      setRequestStatus("requested");
    } catch (err) {
      console.error("Error creating request:", err);
      setError("Failed to create request.");
    }
  };

  const handleChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/chat/api/createRoom",
        { servicemanId: providerId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Chat Room Response:", response.data);
      navigate(`/client/chat`);
    } catch (err) {
      console.error("Error creating chat room:", err);
      setError("Failed to create chat room.");
    }
  };

  return (
    <div className="container mx-auto">
      <Button
        variant="secondary"
        size="sm"
        icon={<ChevronLeft size={16} />}
        onClick={() => navigate?.(-1)}
        className="mb-6"
      >
        Back
      </Button>

      <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg mb-8`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.img
              src={provider?.profilePhoto}
              alt={provider?.fullName}
              className="w-24 h-24 rounded-full object-cover"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <div className="flex-1">
              <h1 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
                {provider?.fullName}
              </h1>
              <div className="flex items-center mb-2">
                <StarRating rating={provider?.rating || 0} />
                <span className={`ml-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {provider?.rating?.toFixed(1) || "0.0"} ({reviews.length} reviews)
                </span>
              </div>
              <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <Clock size={16} className="inline mr-2" />
                {provider?.experience || "Unknown"} experience
              </p>
              <p className={`text-lg font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                {provider?.price || "Not Available"}/hour
              </p>
              <div className="flex items-center mt-2">
                {provider?.availability ? (
                  <span className="flex items-center text-green-500">
                    <CircleCheck size={18} className="mr-1" /> Available
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <CircleX size={18} className="mr-1" /> Unavailable
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button variant="primary" icon={<MessageSquare size={18} />} onClick={handleChat}>
                Chat
              </Button>
              <Button variant="outline" icon={<Phone size={18} />}>
                Call
              </Button>
              <Button
                variant={requestStatus === "requested" ? "disabled" : "secondary"}
                icon={<Calendar size={18} />}
                onClick={handleBook}
                disabled={requestStatus === "requested"}
              >
                {requestStatus === "requested" ? "Requested" : "Book"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg p-6 mb-8`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
              About
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {provider?.description || "No description available."}
            </p>
          </div>

          <div className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Reviews
              </h2>
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {reviews.length} reviews
              </span>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start mb-3">
                      <img src={review.clientPhoto} alt={review.clientname} className="w-10 h-10 rounded-full object-cover mr-3" />
                      <div>
                        <h4 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {review.clientname}
                        </h4>
                        <div className="flex items-center">
                          <StarRating rating={review.rating} size={16} />
                          <span className={`ml-2 text-sm ${darkMode? "text-gray-400" : "text-gray-500"}`}>
                            {new Date(review.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {review.review}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <Star size={40} className="mx-auto mb-3 opacity-30" />
                <p>No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;