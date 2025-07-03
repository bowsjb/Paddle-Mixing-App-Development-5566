import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiX, FiUser, FiLogOut, FiPlus, FiCalendar } = FiIcons;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Paddle Mix</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <Link
                    to="/mixings"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span>Mixings</span>
                  </Link>
                  <Link
                    to="/create-mixing"
                    className="flex items-center space-x-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    <span>Create Mixing</span>
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Hi, {user.user_metadata?.full_name || user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-500 transition-colors"
                    >
                      <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center w-8 h-8 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                  <button
                    onClick={closeMenu}
                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {user ? (
                    <>
                      <div className="pb-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {user.user_metadata?.full_name || user.email}
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/mixings"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">Mixings</span>
                      </Link>

                      <Link
                        to="/create-mixing"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="w-5 h-5 text-primary-600" />
                        <span className="text-primary-600 font-medium">Create Mixing</span>
                      </Link>

                      <button
                        onClick={() => {
                          handleSignOut();
                          closeMenu();
                        }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <SafeIcon icon={FiLogOut} className="w-5 h-5 text-red-600" />
                        <span className="text-red-600">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-800">Sign In</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className="flex items-center justify-center p-3 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
                      >
                        <span className="text-white font-medium">Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;