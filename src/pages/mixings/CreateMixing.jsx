import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';

const CreateMixing = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [releaseType, setReleaseType] = useState('immediate');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchReleaseType = watch('releaseType', 'immediate');

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const rulesOptions = {
    attendancePolicy: ['Failure to attend ruins the game for others'],
    cancellationPolicy: [
      'Pay full mixing fee + €20 bar bill',
      'Pay full mixing fee only',
      'Pay €20 bar bill only',
      'No penalty for cancellation'
    ],
    gameDuration: [
      'First to 6 games',
      'First team to 6 games (shout Cambio, finish simultaneously)',
      '20 minutes max (organizer shouts Cambio)'
    ],
    firstServiceDecision: [
      'First team to win point after 3 net passes',
      'First team to win point after 4 net passes'
    ],
    endGameMovement: [
      'Winners up, losers down, split partners',
      'Winners up, losers down, keep partners',
      'Organizer arranges new games'
    ],
    fortyFortyResolution: [
      'Standard deuce/advantage',
      'Golden point',
      'Golden point - receivers choose serve target'
    ],
    disputeResolution: ['Replay the point (maintains serve count)'],
    philosophy: ['Game of fun - everyone should enjoy']
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const rulesConfig = {
        attendancePolicy: data.attendancePolicy,
        cancellationPolicy: data.cancellationPolicy,
        gameDuration: data.gameDuration,
        firstServiceDecision: data.firstServiceDecision,
        endGameMovement: data.endGameMovement,
        fortyFortyResolution: data.fortyFortyResolution,
        disputeResolution: data.disputeResolution,
        philosophy: data.philosophy
      };

      let releaseDate = null;
      let releaseTime = null;

      if (data.releaseType === 'scheduled') {
        releaseDate = data.releaseDate;
        releaseTime = data.releaseTime;
      }

      const { data: mixingData, error } = await supabase
        .from('mixings')
        .insert([
          {
            title: data.title,
            organizer_id: user.id,
            max_participants: parseInt(data.maxParticipants),
            reserve_spots: parseInt(data.reserveSpots),
            release_date: releaseDate,
            release_time: releaseTime,
            rules_config: rulesConfig,
            people_per_booking: parseInt(data.peoplePerBooking),
            status: data.releaseType === 'immediate' ? 'active' : 'scheduled'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      showToast('Mixing created successfully!', 'success');
      setTimeout(() => navigate('/mixings'), 1500);
    } catch (error) {
      showToast(error.message || 'Failed to create mixing', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Mixing</h1>
              <p className="text-gray-600">Set up your paddle tennis mixing event</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                
                <Input
                  label="Event Title"
                  type="text"
                  fullWidth
                  placeholder="e.g., Weekend Paddle Mixing"
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters'
                    }
                  })}
                  error={errors.title?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Number of Participant Places"
                    type="number"
                    fullWidth
                    min="4"
                    max="20"
                    {...register('maxParticipants', { 
                      required: 'Number of participants is required',
                      min: { value: 4, message: 'Minimum 4 participants required' },
                      max: { value: 20, message: 'Maximum 20 participants allowed' }
                    })}
                    error={errors.maxParticipants?.message}
                  />

                  <Input
                    label="Number of Reserve Places"
                    type="number"
                    fullWidth
                    min="0"
                    max="10"
                    {...register('reserveSpots', { 
                      required: 'Number of reserve spots is required',
                      min: { value: 0, message: 'Minimum 0 reserve spots' },
                      max: { value: 10, message: 'Maximum 10 reserve spots' }
                    })}
                    error={errors.reserveSpots?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    People per Booking
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    {...register('peoplePerBooking', { required: 'Please select people per booking' })}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                  </select>
                  {errors.peoplePerBooking && (
                    <p className="mt-1 text-sm text-red-600">{errors.peoplePerBooking.message}</p>
                  )}
                </div>
              </div>

              {/* Release Scheduling */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Release Scheduling</h2>
                
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="immediate"
                        {...register('releaseType', { required: 'Please select release type' })}
                        className="mr-2"
                      />
                      <span>Immediate release</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="scheduled"
                        {...register('releaseType', { required: 'Please select release type' })}
                        className="mr-2"
                      />
                      <span>Scheduled release</span>
                    </label>
                  </div>

                  {watchReleaseType === 'scheduled' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Release Date"
                        type="date"
                        fullWidth
                        min={format(new Date(), 'yyyy-MM-dd')}
                        {...register('releaseDate', { 
                          required: watchReleaseType === 'scheduled' ? 'Release date is required' : false
                        })}
                        error={errors.releaseDate?.message}
                      />

                      <Input
                        label="Release Time"
                        type="time"
                        fullWidth
                        {...register('releaseTime', { 
                          required: watchReleaseType === 'scheduled' ? 'Release time is required' : false
                        })}
                        error={errors.releaseTime?.message}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Rules Configuration */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Rules Configuration</h2>
                <p className="text-gray-600">Select one option for each rule category</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(rulesOptions).map(([key, options]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        {...register(key, { required: `Please select ${key.replace(/([A-Z])/g, ' $1').trim()}` })}
                      >
                        <option value="">Select...</option>
                        {options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors[key] && (
                        <p className="mt-1 text-sm text-red-600">{errors[key].message}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/mixings')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Create Mixing
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </Layout>
  );
};

export default CreateMixing;