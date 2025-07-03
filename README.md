# Paddle Tennis Mixing App

A modern React application for organizing paddle tennis mixing events with Supabase backend.

## Features

### Part 1 (Completed)
- ✅ User authentication (register, login, logout)
- ✅ Protected routes
- ✅ Mixing creation with basic rules system
- ✅ Mobile-first responsive design
- ✅ Form validation and error handling
- ✅ Toast notifications
- ✅ Loading states

### Part 2 (Completed)
- ✅ **Booking System with Real-time Updates**: Complete booking functionality with live updates
- ✅ **Detailed Mixing View**: Comprehensive event details with participant tracking
- ✅ **Enhanced Rules Display**: Expandable rules sections with clear formatting
- ✅ **Waiting List Management**: Automatic waiting list when events are full
- ✅ **Real-time Participant Tracking**: Live updates when users join/leave
- ✅ **Organizer Controls**: Special permissions for event creators
- ✅ **Booking Modal**: Intuitive booking interface with validation
- ✅ **Participant Lists**: Organized display of confirmed and waiting participants

### Part 3 (Completed)
- ✅ **Email Notifications**: Automated email system for bookings and updates
- ✅ **User Profiles**: Comprehensive user profiles with stats and preferences
- ✅ **Advanced Search & Filtering**: Powerful search and filter system
- ✅ **Analytics Dashboard**: Detailed analytics for event organizers
- ✅ **Notification Center**: In-app notification system
- ✅ **PWA Features**: Progressive Web App capabilities
- ✅ **User Preferences**: Customizable notification settings
- ✅ **Enhanced Navigation**: Improved navigation with new features

## New Features (Part 3)

### 👤 **User Profiles**
- Complete user profile management
- Personal statistics and ratings
- Bio and location information
- Notification preferences
- Activity tracking

### 📊 **Analytics Dashboard**
- Event performance metrics
- Participant engagement stats
- Popular time slots analysis
- Monthly trends visualization
- Recent activity feed

### 🔍 **Advanced Search & Filtering**
- Full-text search across events
- Multi-criteria filtering
- Real-time filter updates
- Saved search preferences
- Smart suggestions

### 🔔 **Notification System**
- In-app notification center
- Email notifications
- Push notifications (PWA)
- Customizable preferences
- Real-time updates

### 📱 **PWA Features**
- Offline functionality
- App-like experience
- Push notifications
- Home screen installation
- Background sync

## Technical Improvements (Part 3)

### 🛠️ **Enhanced Architecture**
- Service layer for notifications
- Utility functions for PWA
- Improved component structure
- Better state management
- Performance optimizations

### 📈 **Analytics & Insights**
- User engagement tracking
- Event performance metrics
- Trend analysis
- Activity monitoring
- Data visualization

### 🔐 **Security & Privacy**
- Enhanced RLS policies
- User preference management
- Data encryption
- Privacy controls
- Audit logging

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file based on `.env.example`:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup
Execute the SQL files in order:
1. `supabase/migrations/2025_create_tables.sql` (Part 1 & 2)
2. `supabase/migrations/20240115_part3_schema.sql` (Part 3)

### 4. Edge Functions Setup
Deploy the email notification function:
```bash
supabase functions deploy send-email
```

### 5. Run the Application
```bash
npm run dev
```

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Forms**: React Hook Form
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Edge Functions)
- **Icons**: React Icons (Feather Icons)
- **Date Handling**: date-fns
- **PWA**: Service Worker, Web App Manifest
- **Notifications**: Web Push API

## New Components (Part 3)

### 👤 **UserProfile**
- Complete profile management
- Statistics dashboard
- Preference settings
- Activity history

### 📊 **AnalyticsDashboard**
- Performance metrics
- Trend visualization
- Activity tracking
- Engagement analytics

### 🔍 **SearchAndFilter**
- Advanced search functionality
- Multi-criteria filtering
- Real-time updates
- Filter persistence

### 🔔 **NotificationCenter**
- In-app notifications
- Real-time updates
- Notification preferences
- Action handling

### 📱 **PWA Components**
- Service worker registration
- Push notification handling
- Offline functionality
- App installation

## Usage Guide

### For Participants
1. **Complete Profile**: Set up your profile with preferences
2. **Search Events**: Use advanced search to find perfect mixings
3. **Get Notifications**: Stay updated with real-time notifications
4. **Track Activity**: Monitor your participation history

### For Organizers
1. **Analytics Dashboard**: Monitor event performance
2. **Participant Management**: Track engagement and feedback
3. **Notifications**: Automated communication with participants
4. **Insights**: Understand your community better

### For All Users
1. **PWA Experience**: Install app for native-like experience
2. **Offline Access**: Basic functionality works offline
3. **Push Notifications**: Get updates even when app is closed
4. **Personalization**: Customize your experience

## What's New in Part 3

### 🚀 **Advanced Features**
- **Complete User Profiles**: Full profile management with stats
- **Smart Analytics**: Comprehensive event performance tracking
- **Powerful Search**: Advanced filtering and search capabilities
- **Notification System**: Complete notification infrastructure
- **PWA Ready**: Full progressive web app capabilities

### 🛠️ **Technical Excellence**
- **Service Architecture**: Clean separation of concerns
- **Performance**: Optimized for speed and efficiency
- **Security**: Enhanced privacy and data protection
- **Scalability**: Built for growth and expansion
- **Maintainability**: Clean, documented code

### 📊 **Business Intelligence**
- **User Insights**: Understand user behavior
- **Event Analytics**: Track event success
- **Engagement Metrics**: Monitor community growth
- **Trend Analysis**: Identify patterns and opportunities
- **Performance Tracking**: Measure key metrics

## Future Enhancements

### Potential Next Steps
- [ ] Social features (friend connections, groups)
- [ ] Payment integration for paid events
- [ ] Calendar integration
- [ ] Advanced matching algorithms
- [ ] Multi-language support
- [ ] API for third-party integrations

The Paddle Tennis Mixing App is now a comprehensive platform ready for production use! 🎉

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

This project is licensed under the MIT License.