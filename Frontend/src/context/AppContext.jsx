import React, { createContext, useContext, useState } from "react";
import { 
  serviceCategories, 
  serviceHistory, 
  userData, 
  transactions, 
  conversations 
} from "../data/mockData";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const value = {
    categories: serviceCategories,
    history: serviceHistory,
    user: userData,
    transactions,
    conversations,
    selectedCategory,
    selectedSubcategory,
    selectedProvider,
    darkMode,
    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedProvider,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
