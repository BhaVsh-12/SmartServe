import React from 'react';
import { motion } from 'framer-motion';

export default function Payments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <p>Payments page content coming soon</p>
      </div>
    </motion.div>
  );
}