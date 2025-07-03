import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } = FiIcons;

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 5000 }) => {
  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    warning: FiAlertCircle,
    info: FiInfo
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-20 right-4 z-50 max-w-sm w-full border rounded-lg shadow-lg ${colors[type]}`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <SafeIcon 
                icon={icons[type]} 
                className={`w-5 h-5 ${iconColors[type]} mr-3 mt-0.5 flex-shrink-0`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;