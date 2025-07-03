import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-16"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;