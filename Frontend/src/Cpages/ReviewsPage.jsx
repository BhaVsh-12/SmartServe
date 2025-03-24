import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import StarRating from "../components/CUI/StarRating";
import Button from "../components/CUI/Button";

const ReviewsPage = () => {
  const { history, darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState("pending");
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});

  const pendingReviews = history.filter(
    (item) => item.status === "Completed" && !Object.keys(ratings).includes(item.id)
  );

  const completedReviews = Object.keys(ratings).map((id) => {
    const historyItem = history.find((item) => item.id === id);
    return {
      id,
      providerName: historyItem?.providerName || "",
      serviceName: historyItem?.serviceName || "",
      date: historyItem?.date || "",
      rating: ratings[id],
      review: reviews[id] || "",
    };
  });

  const handleRatingChange = (id, rating) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const handleReviewChange = (id, text) => {
    setReviews((prev) => ({ ...prev, [id]: text }));
  };

  const handleSubmitReview = (id) => {
    console.log("Submitting review:", {
      id,
      rating: ratings[id],
      review: reviews[id],
    });

    setActiveTab("completed");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto">
      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Feedback & Reviews
      </h1>
      <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        Share your experience and help others find great service providers.
      </p>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "pending"
              ? darkMode
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-indigo-600 border-b-2 border-indigo-600"
              : darkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Reviews ({pendingReviews.length})
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "completed"
              ? darkMode
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-indigo-600 border-b-2 border-indigo-600"
              : darkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Reviews ({completedReviews.length})
        </button>
      </div>

      {/* Pending Reviews */}
      {activeTab === "pending" && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {pendingReviews.length > 0 ? (
            pendingReviews.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {item.serviceName} by {item.providerName}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Completed on {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Rate your experience
                    </label>
                    <StarRating
                      rating={ratings[item.id] || 0}
                      interactive={true}
                      onRatingChange={(rating) => handleRatingChange(item.id, rating)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Write your review
                    </label>
                    <textarea
                      className={`w-full p-3 rounded-lg resize-none ${
                        darkMode
                          ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500"
                          : "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-indigo-300"
                      } focus:outline-none focus:ring-2`}
                      placeholder="Share your experience..."
                      rows={3}
                      value={reviews[item.id] || ""}
                      onChange={(e) => handleReviewChange(item.id, e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSubmitReview(item.id)} disabled={!ratings[item.id]}>
                      Submit Review
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <p className="text-lg">No pending reviews</p>
              <p className="text-sm mt-2">All your services have been reviewed.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Completed Reviews */}
      {activeTab === "completed" && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {completedReviews.length > 0 ? (
            completedReviews.map((review) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {review.serviceName} by {review.providerName}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Reviewed on {review.date}
                      </p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{review.review}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <p className="text-lg">No completed reviews</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ReviewsPage;
