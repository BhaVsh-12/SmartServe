import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const StarRating = ({ rating, maxRating = 5, size = 20, interactive = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };

  const starVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <motion.div
            key={index}
            variants={starVariants}
            initial="initial"
            whileHover={interactive ? "hover" : ""}
            whileTap={interactive ? "tap" : ""}
            className={`cursor-${interactive ? "pointer" : "default"}`}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => handleClick(starValue)}
          >
            <Star
              size={size}
              fill={isFilled ? "#FBBF24" : "transparent"}
              stroke={isFilled ? "#FBBF24" : "#D1D5DB"}
              className={`transition-colors duration-200 ${isFilled ? "text-yellow-400" : "text-gray-300"}`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarRating;
