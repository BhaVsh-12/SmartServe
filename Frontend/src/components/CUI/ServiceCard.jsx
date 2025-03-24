import React from "react";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import { useAppContext } from "../../context/AppContext";

const ServiceCard = ({ provider, onClick }) => {
  const { darkMode } = useAppContext();

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
  };

  return (
    <motion.div
      className={`rounded-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md cursor-pointer`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full object-cover mr-4" />
          <div>
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{provider.name}</h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{provider.experience} experience</p>
          </div>
        </div>

        <div className="flex items-center mb-2">
          <StarRating rating={provider.rating} />
          <span className={`ml-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{provider.rating.toFixed(1)}</span>
        </div>

        <p className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{provider.description}</p>

        <div className={`text-sm font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>{provider.pricing}</div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
