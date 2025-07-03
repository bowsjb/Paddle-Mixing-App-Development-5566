import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Button from '../ui/Button';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiUser, FiClock, FiX } = FiIcons;

const ParticipantsList = ({ bookings, isOrganizer, onCancelBooking }) => {
  const getTotalParticipants = () => {
    return bookings.reduce((sum, booking) => sum + booking.participant_names.length, 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiUsers} className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Participants ({getTotalParticipants()})
          </h2>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No participants yet</p>
          <p className="text-sm text-gray-400">Be the first to book a spot!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {booking.user?.full_name || 'Unknown User'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({booking.participant_names.length} participant{booking.participant_names.length > 1 ? 's' : ''})
                    </span>
                  </div>
                  
                  <div className="ml-6 space-y-1">
                    {booking.participant_names.map((name, nameIndex) => (
                      <div key={nameIndex} className="text-sm text-gray-600">
                        {nameIndex + 1}. {name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-1 mt-2 ml-6">
                    <SafeIcon icon={FiClock} className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Booked {format(new Date(booking.booked_at), 'MMM d, yyyy HH:mm')}
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

export default ParticipantsList;