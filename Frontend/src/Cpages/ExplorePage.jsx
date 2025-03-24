import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const serviceTypes = [
  {
    category: "Home Services",
    icon: "Home",
    services: [
      { icon: "Wrench", title: "Plumbing", description: "Reliable plumbing services for repairs and installations.", providerCount: 15 },
      { icon: "Broom", title: "Cleaning", description: "Professional cleaning services for your home.", providerCount: 22 },
      { icon: "PaintBrush", title: "Painting", description: "High-quality painting services for homes and offices.", providerCount: 10 },
    ],
  },
  {
    category: "Tech Services",
    icon: "Laptop",
    services: [
      { icon: "Server", title: "IT Support", description: "Comprehensive IT support for businesses and individuals.", providerCount: 8 },
      { icon: "Code", title: "Software Development", description: "Custom software solutions for your needs.", providerCount: 12 },
      { icon: "Wifi", title: "Networking", description: "Reliable networking solutions for homes and offices.", providerCount: 5 },
    ],
  },
  {
    category: "Health & Wellness",
    icon: "HeartPulse",
    services: [
      { icon: "Dumbbell", title: "Fitness Training", description: "Personalized fitness programs and training.", providerCount: 18 },
      { icon: "Brain", title: "Mental Health Counseling", description: "Professional support for mental well-being.", providerCount: 7 },
      { icon: "Pill", title: "Physiotherapy", description: "Rehabilitation and therapy for physical conditions.", providerCount: 11 },
    ],
  },
  {
    category: "Business & Finance Services",
    icon: "Briefcase",
    services: [
      { icon: "Calculator", title: "Accounting", description: "Expert accounting and bookkeeping services.", providerCount: 9 },
      { icon: "FileText", title: "Tax Preparation", description: "Comprehensive tax filing and planning.", providerCount: 6 },
      { icon: "TrendingUp", title: "Business Strategy", description: "Strategic consulting for business growth.", providerCount: 14 },
    ],
  },
  {
    category: "Beauty & Personal Care",
    icon: "Sparkles",
    services: [
      { icon: "Scissors", title: "Hair Styling", description: "Professional haircuts and styling services.", providerCount: 20 },
      { icon: "Brush", title: "Makeup", description: "Expert makeup services for any occasion.", providerCount: 16 },
      { icon: "Flower2", title: "Spa Treatments", description: "Relaxing spa and wellness therapies.", providerCount: 13 },
    ],
  },
  {
    category: "Event & Entertainment Services",
    icon: "Music",
    services: [
      { icon: "Camera", title: "Photography", description: "Professional photography and videography services.", providerCount: 17 },
      { icon: "Utensils", title: "Catering", description: "Delicious catering for all events.", providerCount: 19 },
      { icon: "Gem", title: "Wedding Planning", description: "Expert planning for your special day.", providerCount: 21 },
    ],
  },
  {
    category: "Education & Coaching",
    icon: "GraduationCap",
    services: [
      { icon: "BookOpen", title: "Tutoring", description: "Expert tutors for all subjects and grades.", providerCount: 15 },
      { icon: "Mic", title: "Public Speaking Coaching", description: "Professional training for public speaking skills.", providerCount: 8 },
      { icon: "PencilRuler", title: "Skill Development", description: "Learn new skills with expert guidance.", providerCount: 10 },
    ],
  },
  {
    category: "Automobile Services",
    icon: "Car",
    services: [
      { icon: "Wrench", title: "Car Repair", description: "Expert car repair and maintenance services.", providerCount: 22 },
      { icon: "Oil", title: "Oil Change", description: "Regular oil change for your vehicle’s best performance.", providerCount: 12 },
      { icon: "BatteryCharging", title: "Battery Service", description: "Battery replacement and charging services.", providerCount: 9 },
    ],
  },
];

const CategoryCard = ({ category, onClick, darkMode }) => {
  const IconComponent = LucideIcons[
    category.icon.charAt(0).toUpperCase() + category.icon.slice(1)
  ];

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
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
      whileTap="tap"
      onClick={onClick}
    >
      <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          darkMode ? "bg-indigo-900" : "bg-indigo-100"
        }`}
        variants={iconVariants}
      >
        {IconComponent && (
          <IconComponent
            size={32}
            className={darkMode ? "text-indigo-300" : "text-indigo-600"}
          />
        )}
      </motion.div>
      <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
        {category.category}
      </h3>
      <p
        className={`text-xs mt-1 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {category.services.length} services
      </p>
    </motion.div>
  );
};

const SubcategoryItem = ({ service, darkMode }) => {
  const IconComponent = LucideIcons[
    service.icon.charAt(0).toUpperCase() + service.icon.slice(1)
  ];
  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };
    const navigate = useNavigate();
  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`p-4 rounded-lg flex items-center justify-between ${
        darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
      } transition-colors duration-200`}
      onClick={() => navigate(`/client/explore/${service.title.toLowerCase().replace(/ /g, "-")}`)}
    >
      <div className="flex items-center">
        {IconComponent && (
          <IconComponent
            size={24}
            className={`mr-3 ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}
          />
        )}
        <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
          {service.title}
        </span>
      </div>
      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {service.providerCount} Providers
      </span>
    </motion.div>
  );
};

const CategoryCardUI = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const subcategoryVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const filteredCategories = serviceTypes.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 rounded-md pl-10 ${
            darkMode ? "bg-gray-800 text-white border border-gray-700" : "border border-gray-300"
          }`}
        />
        <LucideIcons.Search
          size={20}
          className={`absolute left-3 top-3 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        />
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`mb-4 px-4 py-2 rounded-md ${
          darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Toggle Dark Mode
      </button>
      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <motion.div
            key={selectedCategory.category}
            variants={subcategoryVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-4"
          >
            <motion.button
              onClick={handleBackClick}
              whileTap={{ scale: 0.95 }}
              className={`mb-4 px-4 py-2 rounded-md ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Back
            </motion.button>
            <h2 className="text-2xl font-semibold mb-2">
              {selectedCategory.category} Services
            </h2>
            <div className="space-y-2">
              {selectedCategory.services.map((service, index) => (
                <SubcategoryItem key={index} service={service} darkMode={darkMode} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="categoryGrid"
            variants={subcategoryVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
          >
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.category}
                category={category}
                onClick={() => handleCategoryClick(category)}
                darkMode={darkMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryCardUI;