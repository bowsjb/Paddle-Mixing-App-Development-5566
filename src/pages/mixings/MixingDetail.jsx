import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';
import BookingModal from '../../components/mixings/BookingModal';
import ParticipantsList from '../../components/mixings/ParticipantsList';
import RulesDisplay from '../../components/mixings/RulesDisplay';
import WaitingList from '../../components/mixings/WaitingList';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUsers, FiClock, FiUser, FiMapPin, FiEdit, FiTrash2, FiPlus } = FiIcons;

const MixingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mixing, setMixing] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    if (id) {
      fetchMixingDetails();
      setupRealTimeSubscription();
    }
  }, [id]);

  const fetchMixingDetails = async () => {
    try {
      // Fetch mixing details
      const { data: mixingData, error: mixingError } = await supabase
        .from('mixings')
        .select(`
          *,
          organizer:users!organizer_id(id, full_name, email)
        `)
        .eq('id', id)
        .single();

      if (mixingError) throw mixingError;

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users!user_id(id, full_name, email)
        `)
        .eq('mixing_id', id)
        .order('booked_at', { ascending: true });

      if (bookingsError) throw bookingsError;

      setMixing(mixingData);
      
      // Separate attending and waiting participants
      const attending = bookingsData.filter(b => b.booking_status === 'attending');
      const waiting = bookingsData.filter(b => b.booking_status === 'waiting');
      
      setBookings(attending);
      setWaitingList(waiting);
    } catch (error) {
      console.error('Error fetching mixing details:', error);
      showToast('Failed to load mixing details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscription = () => {
    const channel = supabase
      .channel('mixing-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `mixing_id=eq.${id}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchMixingDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const handleBooking = async (participantNames) => {
    setBookingLoading(true);
    try {
      const totalParticipants = bookings.reduce((sum, booking) => sum + booking.participant_names.length, 0);
      const availableSpots = mixing.max_participants - totalParticipants;
      const requestedSpots = participantNames.length;

      const bookingStatus = requestedSpots <= availableSpots ? 'attending' : 'waiting';

      const { error } = await supabase
        .from('bookings')
        .insert({
          mixing_id: id,
          user_id: user.id,
          participant_names: participantNames,
          booking_status: bookingStatus
        });

      if (error) throw error;

      showToast(
        bookingStatus === 'attending' 
          ? 'Successfully booked your spot!' 
          : 'Added to waiting list - you\'ll be notified if spots become available',
        'success'
      );
      
      setShowBookingModal(false);
      fetchMixingDetails();
    } catch (error) {
      console.error('Error creating booking:', error);
      showToast('Failed to create booking', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          booking_status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      showToast('Booking cancelled successfully', 'success');
      fetchMixingDetails();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showToast('Failed to cancel booking', 'error');
    }
  };

  const isUserBooked = () => {
    return [...bookings, ...waitingList].some(booking => 
      booking.user_id === user?.id && booking.booking_status !== 'cancelled'
    );
  };

  const getUserBooking = () => {
    return [...bookings, ...waitingList].find(booking => 
      booking.user_id === user?.id && booking.booking_status !== 'cancelled'
    );
  };

  const canUserBook = () => {
    return user && !isUserBooked() && mixing?.status === 'active';
  };

  const isOrganizer = () => {
    return user?.id === mixing?.organizer_id;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (!mixing) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Mixing Not Found</h1>
            <Button onClick={() => navigate('/mixings')}>
              Back to Mixings
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const totalParticipants = bookings.reduce((sum, booking) => sum + booking.participant_names.length, 0);
  const availableSpots = mixing.max_participants - totalParticipants;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mixing.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>Organized by {mixing.organizer?.full_name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiClock} className="w-4 h-4" />
                    <span>Created {format(new Date(mixing.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              {isOrganizer() && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="small">
                    <SafeIcon icon={FiEdit} className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{totalParticipants}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{availableSpots}</div>
                <div className="text-sm text-gray-600">Available Spots</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{waitingList.length}</div>
                <div className="text-sm text-gray-600">Waiting List</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mixing.reserve_spots}</div>
                <div className="text-sm text-gray-600">Reserve Spots</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Capacity</span>
                <span className="text-sm text-gray-600">
                  {totalParticipants} / {mixing.max_participants}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((totalParticipants / mixing.max_participants) * 100, 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {canUserBook() && (
                <Button
                  onClick={() => setShowBookingModal(true)}
                  disabled={bookingLoading}
                  loading={bookingLoading}
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Book Spot
                </Button>
              )}
              
              {isUserBooked() && (
                <Button
                  variant="danger"
                  onClick={() => handleCancelBooking(getUserBooking().id)}
                >
                  Cancel Booking
                </Button>
              )}
              
              {!user && (
                <Button onClick={() => navigate('/login')}>
                  Sign In to Book
                </Button>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Participants */}
            <div className="space-y-8">
              <ParticipantsList
                bookings={bookings}
                isOrganizer={isOrganizer()}
                onCancelBooking={handleCancelBooking}
              />
              
              {waitingList.length > 0 && (
                <WaitingList
                  waitingList={waitingList}
                  isOrganizer={isOrganizer()}
                  onCancelBooking={handleCancelBooking}
                />
              )}
            </div>

            {/* Rules */}
            <div>
              <RulesDisplay rules={mixing.rules_config} />
            </div>
          </div>
        </motion.div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleBooking}
          peoplePerBooking={mixing.people_per_booking}
          availableSpots={availableSpots}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={hideToast}
        />
      </div>
    </Layout>
  );
};

export default MixingDetail;