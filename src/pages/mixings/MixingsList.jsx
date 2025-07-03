import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { supabase } from '../../config/supabase';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SearchAndFilter from '../../components/search/SearchAndFilter';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUsers, FiClock, FiArrowRight, FiPlus, FiUser, FiMapPin } = FiIcons;

const MixingsList = () => {
  const [mixings, setMixings] = useState([]);
  const [filteredMixings, setFilteredMixings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchMixings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [mixings, searchTerm, filters]);

  const fetchMixings = async () => {
    try {
      const { data, error } = await supabase
        .from('mixings')
        .select(`
          *,
          organizer:users!organizer_id(full_name),
          bookings(id, booking_status, participant_names)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMixings(data || []);
    } catch (error) {
      console.error('Error fetching mixings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...mixings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(mixing =>
        mixing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mixing.organizer?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mixing.location && mixing.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(mixing => mixing.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(mixing => {
        const mixingDate = new Date(mixing.created_at);
        switch (filters.dateRange) {
          case 'today':
            return isToday(mixingDate);
          case 'week':
            return isThisWeek(mixingDate);
          case 'month':
            return isThisMonth(mixingDate);
          case 'year':
            return isThisYear(mixingDate);
          default:
            return true;
        }
      });
    }

    // Apply participant range filter
    if (filters.participantRange) {
      filtered = filtered.filter(mixing => {
        const maxParticipants = mixing.max_participants;
        switch (filters.participantRange) {
          case 'small':
            return maxParticipants <= 8;
          case 'medium':
            return maxParticipants >= 9 && maxParticipants <= 16;
          case 'large':
            return maxParticipants >= 17;
          default:
            return true;
        }
      });
    }

    // Apply organizer filter
    if (filters.organizer) {
      filtered = filtered.filter(mixing => 
        mixing.organizer?.full_name === filters.organizer
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(mixing =>
        mixing.location && mixing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredMixings(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const getParticipantCount = (bookings) => {
    return bookings?.filter(booking => booking.booking_status === 'attending')
      .reduce((sum, booking) => sum + booking.participant_names.length, 0) || 0;
  };

  const getAvailableSpots = (mixing) => {
    const participantCount = getParticipantCount(mixing.bookings);
    return mixing.max_participants - participantCount;
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paddle Mixings</h1>
            <p className="text-gray-600 mt-2">
              Find and join paddle tennis mixing events
              {filteredMixings.length !== mixings.length && (
                <span className="ml-2 text-primary-600">
                  ({filteredMixings.length} of {mixings.length} shown)
                </span>
              )}
            </p>
          </div>
          <Link
            to="/create-mixing"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Create Mixing</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          mixings={mixings}
        />

        {/* Results */}
        {filteredMixings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {mixings.length === 0 ? 'No mixings available' : 'No mixings match your criteria'}
            </h3>
            <p className="text-gray-600 mb-6">
              {mixings.length === 0 
                ? 'Be the first to create a mixing event!'
                : 'Try adjusting your search or filters to find more events.'
              }
            </p>
            {mixings.length === 0 && (
              <Link
                to="/create-mixing"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create Your First Mixing
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMixings.map((mixing, index) => (
              <motion.div
                key={mixing.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {mixing.title}
                    </h3>
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                      {mixing.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Organized by {mixing.organizer?.full_name || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {getParticipantCount(mixing.bookings)} / {mixing.max_participants} participants
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <SafeIcon icon={FiClock} className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Created {format(new Date(mixing.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>

                    {mixing.location && (
                      <div className="flex items-center text-gray-600">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                        <span className="text-sm">{mixing.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((getParticipantCount(mixing.bookings) / mixing.max_participants) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getAvailableSpots(mixing)} spots remaining
                    </p>
                  </div>

                  <Link
                    to={`/mixings/${mixing.id}`}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>View Details</span>
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MixingsList;