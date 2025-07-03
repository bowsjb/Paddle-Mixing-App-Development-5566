import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiPhone, FiSettings, FiBell, FiCalendar, FiTrendingUp, FiEdit } = FiIcons;

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalMixings: 0,
    totalParticipations: 0,
    organizerRating: 0,
    participantRating: 0
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    marketingEmails: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserStats();
      fetchUserPreferences();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Failed to load profile', 'error');
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get mixing stats
      const { data: mixingStats, error: mixingError } = await supabase
        .from('mixings')
        .select('id, status')
        .eq('organizer_id', user.id);

      if (mixingError) throw mixingError;

      // Get participation stats
      const { data: participationStats, error: participationError } = await supabase
        .from('bookings')
        .select('id, booking_status')
        .eq('user_id', user.id)
        .eq('booking_status', 'attending');

      if (participationError) throw participationError;

      setStats({
        totalMixings: mixingStats?.length || 0,
        totalParticipations: participationStats?.length || 0,
        organizerRating: 4.8, // Mock rating
        participantRating: 4.6 // Mock rating
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const handleProfileUpdate = async (formData) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        full_name: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location
      }));

      showToast('Profile updated successfully!', 'success');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesUpdate = async (newPreferences) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: newPreferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setPreferences(newPreferences);
      showToast('Preferences updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating preferences:', error);
      showToast('Failed to update preferences', 'error');
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.full_name || 'User Profile'}
                  </h1>
                  <p className="text-gray-600">{profile?.email}</p>
                </div>
              </div>
              <Button
                onClick={() => setEditing(!editing)}
                variant="outline"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-600">{stats.totalMixings}</div>
                <div className="text-sm text-gray-600">Events Organized</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalParticipations}</div>
                <div className="text-sm text-gray-600">Events Joined</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.organizerRating}</div>
                <div className="text-sm text-gray-600">Organizer Rating</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.participantRating}</div>
                <div className="text-sm text-gray-600">Participant Rating</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              {editing ? (
                <ProfileEditForm
                  profile={profile}
                  onSave={handleProfileUpdate}
                  saving={saving}
                />
              ) : (
                <ProfileDisplay profile={profile} />
              )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              
              <NotificationSettings
                preferences={preferences}
                onUpdate={handlePreferencesUpdate}
                saving={saving}
              />
            </div>
          </div>
        </motion.div>

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

const ProfileDisplay = ({ profile }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-3">
      <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <p className="text-gray-900">{profile?.full_name || 'Not provided'}</p>
      </div>
    </div>
    
    <div className="flex items-center space-x-3">
      <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="text-gray-900">{profile?.email}</p>
      </div>
    </div>
    
    <div className="flex items-center space-x-3">
      <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
      </div>
    </div>
    
    <div className="flex items-start space-x-3">
      <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-400 mt-1" />
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <p className="text-gray-900">{profile?.bio || 'No bio provided'}</p>
      </div>
    </div>
  </div>
);

const ProfileEditForm = ({ profile, onSave, saving }) => {
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    location: profile?.location || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
        fullWidth
        required
      />
      
      <Input
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        fullWidth
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Tell us about yourself..."
        />
      </div>
      
      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
        fullWidth
        placeholder="City, Country"
      />
      
      <Button
        type="submit"
        loading={saving}
        disabled={saving}
        fullWidth
      >
        Save Changes
      </Button>
    </form>
  );
};

const NotificationSettings = ({ preferences, onUpdate, saving }) => {
  const handleToggle = (key) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    onUpdate(newPreferences);
  };

  const settings = [
    {
      key: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive notifications about booking confirmations and updates',
      icon: FiMail
    },
    {
      key: 'smsNotifications',
      label: 'SMS Notifications',
      description: 'Get text messages for urgent updates',
      icon: FiPhone
    },
    {
      key: 'eventReminders',
      label: 'Event Reminders',
      description: 'Receive reminders before your events',
      icon: FiBell
    },
    {
      key: 'marketingEmails',
      label: 'Marketing Emails',
      description: 'Get updates about new features and promotions',
      icon: FiTrendingUp
    }
  ];

  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={setting.icon} className="w-5 h-5 text-gray-400" />
            <div>
              <h4 className="font-medium text-gray-900">{setting.label}</h4>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle(setting.key)}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences[setting.key] ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences[setting.key] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;