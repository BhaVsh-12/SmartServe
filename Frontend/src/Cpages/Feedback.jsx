import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

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

const ReviewCard = ({ review }) => {
  return (
    <motion.div 
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md" 
      whileHover={{ scale: 1.05 }}>
      <div className="flex items-center mb-2">
        <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h4 className="text-gray-800 dark:text-white font-medium">{review.name}</h4>
          <StarRating rating={review.rating} />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
    </motion.div>
  );
};

const ReviewSection = () => {
  const [reviews, setReviews] = useState([
    { id: 1, name: "John Doe", rating: 5, comment: "Excellent service!", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Jane Smith", rating: 4, comment: "Very professional and timely.", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "Mike Johnson", rating: 3, comment: "Good service, but can improve.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 3, name: "Mike Johnson", rating: 3, comment: "Good service, but can improve.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" }
  
  ]);

  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "", avatar: "https://randomuser.me/api/portraits/men/4.jpg" });

  const handleAddReview = () => {
    if (newReview.name && newReview.comment) {
      setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
      setNewReview({ name: "", rating: 5, comment: "", avatar: "https://randomuser.me/api/portraits/men/4.jpg" });
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Customer Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
    </div>
  );
};

export default ReviewSection;
