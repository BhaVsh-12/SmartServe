import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const CategoryCard = ({ category, onClick }) => {
  const { darkMode } = useAppContext();

  // Dynamically get the icon component
  const IconComponent = LucideIcons[category.icon.charAt(0).toUpperCase() + category.icon.slice(1)];

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 10, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${
        darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
      } shadow-md cursor-pointer p-6 flex flex-col items-center justify-center text-center transition-colors duration-200`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={onClick}
    >
      <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          darkMode ? "bg-indigo-900" : "bg-indigo-100"
        }`}
        variants={iconVariants}
      >
        {IconComponent && <IconComponent size={32} className={darkMode ? "text-indigo-300" : "text-indigo-600"} />}
      </motion.div>
      <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{category.name}</h3>
      <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {category.subcategories.length} services
      </p>
    </motion.div>
  );
};

export default CategoryCard;
