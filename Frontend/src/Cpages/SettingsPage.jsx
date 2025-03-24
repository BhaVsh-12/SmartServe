import React from "react";
import { motion } from "framer-motion";
import { Moon, Bell, Lock, Globe, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/CUI/Button";

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useAppContext();

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
        Settings
      </h1>
      <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        Manage your preferences and account settings.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Appearance */}
        <motion.div variants={itemVariants} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Appearance</h2>
            
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon size={20} className={`mr-3 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Dark Mode</p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Toggle between light and dark theme</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={toggleDarkMode} />
                  <div className={`w-11 h-6 rounded-full peer bg-gray-300 peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Notifications</h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell size={20} className={`mr-3 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                    <div>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Email Notifications</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Receive booking confirmations and updates</p>
                    </div>
                  </div>
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div variants={itemVariants} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Privacy</h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye size={20} className={`mr-3 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                    <div>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Profile Visibility</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Allow others to see your profile</p>
                    </div>
                  </div>
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div variants={itemVariants} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Security</h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex items-center">
                  <Lock size={20} className={`mr-3 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Change Password</p>
                    <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Update your password for better security</p>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex items-center">
                  <Globe size={20} className={`mr-3 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Two-Factor Authentication</p>
                    <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Add extra security</p>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
