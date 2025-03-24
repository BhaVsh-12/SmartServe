import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  User, 
  MessageSquare, 
  FileText, 
  Star, 
  CreditCard,
  Crown,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import clsx from "clsx";

const navItems = [
  { icon: User, label: "Profile", path: "profile" },
  { icon: FileText, label: "Requests", path: "requests" },
  { icon: MessageSquare, label: "Chat", path: "chat" },
  { icon: CreditCard, label: "Payments", path: "payments" },
  { icon: Star, label: "Reviews", path: "reviews" },
  { icon: Crown, label: "Membership", path: "membership" },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // ✅ Load Sidebar State from LocalStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("isSidebarOpen");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("isSidebarOpen", JSON.stringify(newState));
      return newState;
    });
  };

  // ✅ Handle Logout (Clearing Auth)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      className={clsx(
        "min-h-screen transition-colors duration-300",
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      )}
    >
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary-500 text-white "
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex fixed bottom-4 left-4 z-50 p-2 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors"
      >
        {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: isSidebarOpen ? 0 : -300, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={clsx(
          "fixed top-0 left-0 h-full w-64 p-4 transition-colors duration-300",
          theme === "dark" ? "bg-gray-800" : "bg-white",
          "shadow-lg z-40"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">ServicePro</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-20 left-4 right-4 flex items-center justify-center space-x-2 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <main
        className={clsx(
          "transition-all duration-300",
          isSidebarOpen ? "lg:ml-64" : "ml-0",
          "p-4 lg:p-8"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
