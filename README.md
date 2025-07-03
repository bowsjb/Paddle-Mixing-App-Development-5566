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

### Part 3 (Coming Next)
- [ ] Email notifications
- [ ] User profiles
- [ ] Search and filtering
- [ ] PWA features
- [ ] Analytics dashboard

## New Components (Part 2)

### 🎯 **MixingDetail Page**
- Complete event overview with real-time stats
- Booking functionality with instant updates
- Organizer controls for event management
- Progress tracking and capacity management

### 📋 **BookingModal**
- Dynamic participant name entry
- Validation for booking limits
- Waiting list notifications
- Responsive design for mobile

### 👥 **ParticipantsList**
- Real-time participant tracking
- Booking timestamps
- Organizer actions (cancel bookings)
- Participant count display

### ⏰ **WaitingList**
- Queue position display
- Automatic promotion when spots open
- Waiting list management
- Clear visual indicators

### 📖 **RulesDisplay**
- Expandable rule sections
- Clear categorization
- Enhanced readability
- Mobile-optimized layout

## Real-time Features

### 🔄 **Live Updates**
- Automatic refresh when bookings change
- Real-time participant count updates
- Instant waiting list management
- Live capacity tracking

### 📊 **Smart Booking Logic**
- Automatic waiting list assignment
- Spot availability calculation
- Booking validation
- Conflict prevention

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
Execute the following SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mixings table
CREATE TABLE mixings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organizer_id UUID REFERENCES users(id) NOT NULL,
  max_participants INTEGER NOT NULL,
  reserve_spots INTEGER NOT NULL DEFAULT 0,
  release_date DATE,
  release_time TIME,
  rules_config JSONB NOT NULL,
  people_per_booking INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mixing_id UUID REFERENCES mixings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  participant_names TEXT[] NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'attending' CHECK (booking_status IN ('attending', 'cancelled', 'waiting')),
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mixings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view active mixings" ON mixings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create mixings" ON mixings FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own mixings" ON mixings FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Users can view bookings for mixings they're involved in" ON bookings FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT organizer_id FROM mixings WHERE id = mixing_id)
);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Run the Application
```bash
npm run dev
```

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Forms**: React Hook Form
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: React Icons (Feather Icons)
- **Date Handling**: date-fns
- **Real-time**: Supabase Realtime subscriptions

## Key Features Implemented

### 🎯 **Advanced Booking System**
- Multi-participant booking support
- Automatic waiting list management
- Real-time capacity tracking
- Booking validation and conflict prevention

### 📱 **Mobile-First Design**
- Responsive layouts for all screen sizes
- Touch-friendly interactions
- Optimized for mobile usage
- Progressive enhancement

### 🔒 **Security & Permissions**
- Row-level security (RLS) policies
- Organizer-specific controls
- Protected routes and actions
- Secure user authentication

### ⚡ **Performance Optimizations**
- Real-time subscriptions for live updates
- Optimistic UI updates
- Efficient data fetching
- Minimal re-renders

## Usage Guide

### For Participants
1. **Browse Events**: View available mixing events
2. **Book Spots**: Reserve spots for yourself and friends
3. **Join Waiting List**: Get notified when spots become available
4. **Manage Bookings**: Cancel or modify your reservations

### For Organizers
1. **Create Events**: Set up mixing events with custom rules
2. **Manage Participants**: View and manage all bookings
3. **Monitor Capacity**: Track event filling and waiting lists
4. **Enforce Rules**: Manage cancellations and disputes

## What's New in Part 2

### 🚀 **Enhanced User Experience**
- **Real-time Updates**: See changes instantly without refreshing
- **Smart Booking**: Automatic waiting list management
- **Detailed Views**: Comprehensive event information
- **Mobile Optimization**: Perfect experience on all devices

### 🛠️ **Technical Improvements**
- **Component Architecture**: Modular, reusable components
- **State Management**: Efficient real-time state updates
- **Error Handling**: Comprehensive error management
- **Performance**: Optimized rendering and data fetching

### 📊 **Advanced Features**
- **Capacity Management**: Smart spot allocation
- **Queue System**: Fair waiting list management
- **Real-time Notifications**: Instant feedback on actions
- **Organizer Tools**: Powerful event management capabilities

Ready for Part 3! 🎉