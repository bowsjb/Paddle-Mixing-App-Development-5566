import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUsers, FiClock, FiTrendingUp } = FiIcons;

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: FiCalendar,
      title: 'Easy Scheduling',
      description: 'Create and manage paddle tennis mixing events with flexible scheduling options.'
    },
    {
      icon: FiUsers,
      title: 'Community Building',
      description: 'Connect with other paddle tennis enthusiasts and build lasting friendships.'
    },
    {
      icon: FiClock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about bookings, cancellations, and event changes.'
    },
    {
      icon: FiTrendingUp,
      title: 'Smart Management',
      description: 'Automated waiting lists, custom rules, and comprehensive event analytics.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
            >
              Paddle Tennis
              <span className="text-primary-500 block">Mixing Made Easy</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Create, join, and manage paddle tennis mixing events with our intuitive platform. 
              Connect with players, set custom rules, and enjoy seamless event organization.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {user ? (
                <>
                  <Link
                    to="/mixings"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    View Mixings
                  </Link>
                  <Link
                    to="/create-mixing"
                    className="bg-white hover:bg-gray-50 text-primary-500 px-8 py-3 rounded-lg font-medium border border-primary-500 transition-colors"
                  >
                    Create Mixing
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white hover:bg-gray-50 text-primary-500 px-8 py-3 rounded-lg font-medium border border-primary-500 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Paddle Mix?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to organize successful paddle tennis mixing events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Mixing?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of paddle tennis players who trust Paddle Mix for their events
            </p>
            {!user && (
              <Link
                to="/register"
                className="bg-white hover:bg-gray-100 text-primary-500 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Sign Up Now
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;