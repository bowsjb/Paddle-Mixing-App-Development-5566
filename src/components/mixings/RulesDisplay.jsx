import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiChevronDown, FiChevronUp } = FiIcons;

const RulesDisplay = ({ rules }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const rulesConfig = {
    attendancePolicy: {
      title: 'Attendance Policy',
      icon: FiBook,
      description: 'Rules regarding attendance and participation'
    },
    cancellationPolicy: {
      title: 'Cancellation Policy',
      icon: FiBook,
      description: 'Penalties and rules for cancellations'
    },
    gameDuration: {
      title: 'Game Duration',
      icon: FiBook,
      description: 'How long games last and when they end'
    },
    firstServiceDecision: {
      title: 'First Service Decision',
      icon: FiBook,
      description: 'How to determine who serves first'
    },
    endGameMovement: {
      title: 'End Game Movement',
      icon: FiBook,
      description: 'How players move between games'
    },
    fortyFortyResolution: {
      title: 'Deuce Resolution',
      icon: FiBook,
      description: 'How to resolve tied games at 40-40'
    },
    disputeResolution: {
      title: 'Dispute Resolution',
      icon: FiBook,
      description: 'How to handle disagreements during play'
    },
    philosophy: {
      title: 'Philosophy',
      icon: FiBook,
      description: 'Overall approach and spirit of the game'
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <SafeIcon icon={FiBook} className="w-6 h-6 text-primary-500" />
        <h2 className="text-xl font-bold text-gray-900">Game Rules</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(rulesConfig).map(([key, config]) => {
          const isExpanded = expandedSections[key];
          const ruleValue = rules[key];

          if (!ruleValue) return null;

          return (
            <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={config.icon} className="w-5 h-5 text-primary-500" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{config.title}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                </div>
                <SafeIcon 
                  icon={isExpanded ? FiChevronUp : FiChevronDown} 
                  className="w-5 h-5 text-gray-400" 
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="bg-primary-50 p-3 rounded-lg">
                        <p className="text-primary-800 font-medium">{ruleValue}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All participants must follow the established rules</li>
          <li>• Rules are set by the organizer and cannot be changed during the event</li>
          <li>• Fair play and respect for all participants is expected</li>
        </ul>
      </div>
    </div>
  );
};

export default RulesDisplay;