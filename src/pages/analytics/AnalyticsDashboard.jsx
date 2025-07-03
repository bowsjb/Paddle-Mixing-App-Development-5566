import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart, FiUsers, FiCalendar, FiTrendingUp, FiActivity, FiClock } = FiIcons;

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalMixings: 0,
    totalParticipants: 0,
    averageParticipation: 0,
    completionRate: 0,
    popularTimeSlots: [],
    monthlyTrends: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const endDate = new Date();
      const startDate = timeRange === '30d' 
        ? subDays(endDate, 30)
        : startOfMonth(endDate);

      // Fetch mixing analytics
      const { data: mixings, error: mixingsError } = await supabase
        .from('mixings')
        .select(`
          *,
          bookings(id, booking_status, participant_names, booked_at)
        `)
        .eq('organizer_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (mixingsError) throw mixingsError;

      // Calculate analytics
      const totalMixings = mixings?.length || 0;
      const totalParticipants = mixings?.reduce((sum, mixing) => 
        sum + (mixing.bookings?.filter(b => b.booking_status === 'attending').length || 0), 0
      ) || 0;
      
      const averageParticipation = totalMixings > 0 ? totalParticipants / totalMixings : 0;
      
      const completedMixings = mixings?.filter(m => m.status === 'completed').length || 0;
      const completionRate = totalMixings > 0 ? (completedMixings / totalMixings) * 100 : 0;

      // Generate monthly trends
      const monthlyTrends = generateMonthlyTrends(mixings);
      
      // Generate recent activity
      const recentActivity = generateRecentActivity(mixings);

      setAnalytics({
        totalMixings,
        totalParticipants,
        averageParticipation: Math.round(averageParticipation * 10) / 10,
        completionRate: Math.round(completionRate),
        popularTimeSlots: ['18:00-20:00', '20:00-22:00', '16:00-18:00'],
        monthlyTrends,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyTrends = (mixings) => {
    const trends = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = subDays(now, i * 5);
      const dateStr = format(date, 'MMM dd');
      const count = mixings?.filter(m => 
        format(new Date(m.created_at), 'MMM dd') === dateStr
      ).length || 0;
      
      trends.push({ date: dateStr, count });
    }
    
    return trends;
  };

  const generateRecentActivity = (mixings) => {
    const activities = [];
    
    mixings?.forEach(mixing => {
      activities.push({
        id: mixing.id,
        type: 'mixing_created',
        title: `Created "${mixing.title}"`,
        date: mixing.created_at,
        participants: mixing.bookings?.filter(b => b.booking_status === 'attending').length || 0
      });
      
      mixing.bookings?.forEach(booking => {
        if (booking.booking_status === 'attending') {
          activities.push({
            id: booking.id,
            type: 'booking_confirmed',
            title: `New booking for "${mixing.title}"`,
            date: booking.booked_at,
            participants: booking.participant_names.length
          });
        }
      });
    });
    
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your mixing events performance</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === '30d' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === 'month' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Mixings"
              value={analytics.totalMixings}
              icon={FiCalendar}
              color="primary"
              trend="+12%"
            />
            <StatCard
              title="Total Participants"
              value={analytics.totalParticipants}
              icon={FiUsers}
              color="green"
              trend="+8%"
            />
            <StatCard
              title="Avg. Participation"
              value={analytics.averageParticipation}
              icon={FiTrendingUp}
              color="yellow"
              trend="+5%"
            />
            <StatCard
              title="Completion Rate"
              value={`${analytics.completionRate}%`}
              icon={FiActivity}
              color="blue"
              trend="+3%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trends Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Event Trends</h2>
              <TrendsChart data={analytics.monthlyTrends} />
            </div>

            {/* Popular Time Slots */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Time Slots</h2>
              <div className="space-y-4">
                {analytics.popularTimeSlots.map((slot, index) => (
                  <div key={slot} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{slot}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${100 - (index * 20)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{100 - (index * 20)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <RecentActivity activities={analytics.recentActivity} />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <SafeIcon icon={icon} className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className="text-green-600 text-sm font-medium">{trend}</span>
        <span className="text-gray-600 text-sm ml-2">from last period</span>
      </div>
    </div>
  );
};

const TrendsChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.count));
  
  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-t-lg relative flex-1 flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.count / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full bg-primary-500 rounded-t-lg"
              />
            </div>
            <div className="text-xs text-gray-600 mt-2">{item.date}</div>
            <div className="text-sm font-medium text-gray-900">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'mixing_created':
        return FiCalendar;
      case 'booking_confirmed':
        return FiUsers;
      default:
        return FiActivity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'mixing_created':
        return 'text-blue-600 bg-blue-50';
      case 'booking_confirmed':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <SafeIcon icon={FiActivity} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
              <SafeIcon icon={getActivityIcon(activity.type)} className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">
                {format(new Date(activity.date), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
            {activity.participants > 0 && (
              <div className="text-sm text-gray-500">
                {activity.participants} participant{activity.participants > 1 ? 's' : ''}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AnalyticsDashboard;