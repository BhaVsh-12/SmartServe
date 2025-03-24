import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  MessageSquare,
  Star,
  Clock,
  User,
  Settings,
  CreditCard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const Sidebar = () => {
  const { darkMode } = useAppContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const navItems = [
    { path: "/client/explore", icon: <Home size={20} />, label: "Explore" },
    { path: "/client/chat", icon: <MessageSquare size={20} />, label: "Chat" },
    { path: "/client/reviews", icon: <Star size={20} />, label: "Feedback & Reviews" },
    { path: "/client/history", icon: <Clock size={20} />, label: "Service History" },
    { path: "/client/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/client/settings", icon: <Settings size={20} />, label: "Settings" },
    { path: "/client/payment", icon: <CreditCard size={20} />, label: "Payment" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className={`hidden md:flex flex-col h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } border-r shadow-sm`}
        animate={isCollapsed ? { width: "70px" } : { width: "240px" }}
        initial={false}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <h1 className="text-xl font-bold">ServiceHub</h1>}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-900 text-white"
                      : "bg-indigo-100 text-indigo-800"
                    : darkMode
                    ? "text-gray-300 hover:bg-indigo-900/50"
                    : "text-gray-700 hover:bg-indigo-50"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Dark overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
            onClick={toggleMobileMenu}
          />
          {/* Sidebar */}
          <motion.div
            className={`fixed top-0 left-0 h-screen w-64 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
            } z-30 md:hidden shadow-xl`}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-xl font-bold">ServiceHub</h1>
              <button onClick={toggleMobileMenu} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="px-3 py-4 flex flex-col gap-2 overflow-y-auto">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? darkMode
                          ? "bg-indigo-900 text-white"
                          : "bg-indigo-100 text-indigo-800"
                        : darkMode
                        ? "text-gray-300 hover:bg-indigo-900/50"
                        : "text-gray-700 hover:bg-indigo-50"
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  <span>{item.icon}</span>
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center p-2 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Sidebar;
