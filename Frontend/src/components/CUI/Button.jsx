import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  onClick,
  disabled = false,
  type = "button",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
      case "secondary":
        return "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200";
      case "outline":
        return "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/30";
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs py-1 px-3";
      case "md":
        return "text-sm py-2 px-4";
      case "lg":
        return "text-base py-3 px-6";
      default:
        return "text-sm py-2 px-4";
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  return (
    <motion.button
      type={type}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        rounded-lg font-medium transition-colors duration-200
        flex items-center justify-center gap-2
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={onClick}
      disabled={disabled}
      variants={buttonVariants}
      initial="initial"
      whileHover={disabled ? "" : "hover"}
      whileTap={disabled ? "" : "tap"}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
