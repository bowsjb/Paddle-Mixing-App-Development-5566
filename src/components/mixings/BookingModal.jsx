import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiUser, FiUsers } = FiIcons;

const BookingModal = ({ isOpen, onClose, onConfirm, peoplePerBooking, availableSpots }) => {
  const [participantNames, setParticipantNames] = useState(['']);
  const [loading, setLoading] = useState(false);

  const handleAddParticipant = () => {
    if (participantNames.length < peoplePerBooking) {
      setParticipantNames([...participantNames, '']);
    }
  };

  const handleRemoveParticipant = (index) => {
    if (participantNames.length > 1) {
      setParticipantNames(participantNames.filter((_, i) => i !== index));
    }
  };

  const handleParticipantNameChange = (index, value) => {
    const newNames = [...participantNames];
    newNames[index] = value;
    setParticipantNames(newNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validNames = participantNames.filter(name => name.trim());
    
    if (validNames.length === 0) {
      return;
    }

    setLoading(true);
    await onConfirm(validNames);
    setLoading(false);
    
    // Reset form
    setParticipantNames(['']);
  };

  const handleClose = () => {
    setParticipantNames(['']);
    onClose();
  };

  const isFormValid = participantNames.some(name => name.trim());
  const willGoToWaitingList = participantNames.filter(name => name.trim()).length > availableSpots;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book Your Spot</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Names
                  </label>
                  <div className="space-y-3">
                    {participantNames.map((name, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder={`Participant ${index + 1} name`}
                          value={name}
                          onChange={(e) => handleParticipantNameChange(index, e.target.value)}
                          fullWidth
                        />
                        {participantNames.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipant(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {participantNames.length < peoplePerBooking && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddParticipant}
                    fullWidth
                  >
                    <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                    Add Participant
                  </Button>
                )}

                {willGoToWaitingList && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <SafeIcon icon={FiUsers} className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Waiting List</h4>
                        <p className="text-sm text-yellow-700">
                          Not enough spots available. You'll be added to the waiting list and notified if spots become available.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid || loading}
                    loading={loading}
                    fullWidth
                  >
                    {willGoToWaitingList ? 'Join Waiting List' : 'Book Spot'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;