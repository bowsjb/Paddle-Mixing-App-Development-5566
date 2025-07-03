import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Button from '../ui/Button';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiUser, FiX } = FiIcons;

const WaitingList = ({ waitingList, isOrganizer, onCancelBooking }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiClock} className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Waiting List ({waitingList.length})
          </h2>
        </div>
      </div>

      {waitingList.length === 0 ? (
        <div className="text-center py-8">
          <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No one on waiting list</p>
          <p className="text-sm text-gray-400">All spots are available!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {waitingList.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-yellow-200 rounded-lg p-4 bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {booking.user?.full_name || 'Unknown User'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({booking.participant_names.length} participant{booking.participant_names.length > 1 ? 's' : ''})
                    </span>
                  </div>
                  
                  <div className="ml-8 space-y-1">
                    {booking.participant_names.map((name, nameIndex) => (
                      <div key={nameIndex} className="text-sm text-gray-600">
                        {nameIndex + 1}. {name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-1 mt-2 ml-8">
                    <SafeIcon icon={FiClock} className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Joined waiting list {format(new Date(booking.booked_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                </div>

                {isOrganizer && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => onCancelBooking(booking.id)}
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaitingList;