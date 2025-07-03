import { supabase } from '../config/supabase';

class NotificationService {
  async sendBookingConfirmation(booking, mixing) {
    try {
      // Send email notification
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: booking.user.email,
          subject: `Booking Confirmed: ${mixing.title}`,
          template: 'booking-confirmation',
          data: {
            userName: booking.user.full_name,
            mixingTitle: mixing.title,
            organizerName: mixing.organizer.full_name,
            participantNames: booking.participant_names,
            bookingStatus: booking.booking_status
          }
        }
      });

      if (error) throw error;

      // Store notification in database
      await this.createNotification({
        user_id: booking.user_id,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: `Your booking for "${mixing.title}" has been confirmed.`,
        data: {
          mixing_id: mixing.id,
          booking_id: booking.id
        }
      });
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
    }
  }

  async sendWaitingListNotification(booking, mixing) {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: booking.user.email,
          subject: `Added to Waiting List: ${mixing.title}`,
          template: 'waiting-list',
          data: {
            userName: booking.user.full_name,
            mixingTitle: mixing.title,
            organizerName: mixing.organizer.full_name,
            participantNames: booking.participant_names
          }
        }
      });

      if (error) throw error;

      await this.createNotification({
        user_id: booking.user_id,
        type: 'waiting_list',
        title: 'Added to Waiting List',
        message: `You've been added to the waiting list for "${mixing.title}".`,
        data: {
          mixing_id: mixing.id,
          booking_id: booking.id
        }
      });
    } catch (error) {
      console.error('Error sending waiting list notification:', error);
    }
  }

  async sendSpotAvailableNotification(booking, mixing) {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: booking.user.email,
          subject: `Spot Available: ${mixing.title}`,
          template: 'spot-available',
          data: {
            userName: booking.user.full_name,
            mixingTitle: mixing.title,
            organizerName: mixing.organizer.full_name,
            mixingUrl: `${window.location.origin}/mixings/${mixing.id}`
          }
        }
      });

      if (error) throw error;

      await this.createNotification({
        user_id: booking.user_id,
        type: 'spot_available',
        title: 'Spot Available',
        message: `A spot is now available for "${mixing.title}".`,
        data: {
          mixing_id: mixing.id,
          booking_id: booking.id
        }
      });
    } catch (error) {
      console.error('Error sending spot available notification:', error);
    }
  }

  async sendEventReminder(mixing, participants) {
    try {
      const reminderPromises = participants.map(async (participant) => {
        await supabase.functions.invoke('send-email', {
          body: {
            to: participant.email,
            subject: `Event Reminder: ${mixing.title}`,
            template: 'event-reminder',
            data: {
              userName: participant.full_name,
              mixingTitle: mixing.title,
              organizerName: mixing.organizer.full_name,
              eventDate: mixing.event_date,
              eventTime: mixing.event_time,
              location: mixing.location
            }
          }
        });

        await this.createNotification({
          user_id: participant.id,
          type: 'event_reminder',
          title: 'Event Reminder',
          message: `Don't forget about "${mixing.title}" coming up soon!`,
          data: {
            mixing_id: mixing.id
          }
        });
      });

      await Promise.all(reminderPromises);
    } catch (error) {
      console.error('Error sending event reminders:', error);
    }
  }

  async createNotification(notification) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async getUserNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
}

export default new NotificationService();