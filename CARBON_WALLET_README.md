# Carbon Wallet - Personal Carbon Footprint Tracker

## Overview

Carbon Wallet is a comprehensive web application designed to help individuals track, understand, and reduce their carbon footprint through daily activities including exercise, food consumption, and travel behavior. The platform provides real-time tracking, automated calculations, and actionable suggestions for reducing environmental impact and costs.

## Key Features

### 🔐 Authentication System
- Secure user registration and login
- Password hashing with SHA-256
- Session management
- Protected routes

### 👤 User Profile Management
- Personal information (age, gender, height, weight, activity level)
- Customizable profile settings
- Data used for personalized calculations

### 🏃 Exercise Tracking
- Track various exercise types (Walking, Running, Cycling, Gym, Yoga)
- Calculate calories burned based on user profile
- Estimate weight change projections
- Monitor carbon impact from exercise activities
- Visual progress indicators

### 🍽️ Food Intake Tracking
- Track food categories (Vegetarian, Non-vegetarian, Vegan)
- Monitor food types and quantities
- Calculate daily/weekly/monthly carbon emissions
- Visualize emission breakdown with pie charts
- Compare with average user data

### 🚗 Manual Travel Tracking
- Log travel by mode (Car, Bike, Public Transport, Train, Walk)
- Track distance, fuel type, and vehicle details
- Calculate carbon emissions and fuel costs
- Cost per kilometer analysis
- Trip summaries

### 📍 Real-Time GPS Tracking
- Live GPS-based journey tracking
- Automatic distance calculation
- Real-time carbon and cost monitoring
- Pause/resume functionality
- Average speed tracking
- Save complete trip data

### 💡 Alternative Suggestions Engine
- Instant greener alternatives after every calculation
- One-click application of suggestions
- Immediate recalculation showing:
  - Reduced carbon emissions
  - Cost savings
  - Percentage improvement

### 📊 History & Analytics
- Comprehensive activity history
- Filter by date range and activity type
- Search functionality
- Daily summary statistics
- Weekly comparison charts
- Monthly trend analysis
- Progress tracking with visualizations

### 🔔 Smart Notifications
- Real-time toast notifications
- Activity tracking confirmations
- Error handling with user-friendly messages
- Success feedback

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with custom eco-friendly theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Validation**: Zod
- **Build Tool**: Vite
- **Data Storage**: localStorage (browser-based)

## Design System

### Color Palette
- **Primary**: Eco-friendly green (#2ECC71 / HSL 145° 63% 49%)
- **Secondary**: Complementary blue
- **Accent**: Vibrant highlights
- **Background**: Clean white with subtle grays
- **Muted**: Neutral tones for secondary content

### Design Principles
- Card-based modular layout
- Soft rounded corners (8px radius)
- Subtle shadows for depth
- Minimalist icons with nature-inspired elements
- Smooth transitions and animations
- Mobile-first responsive design

## Calculation Methodology

### Exercise Calculations
- Uses MET (Metabolic Equivalent of Task) values
- Personalized based on user weight and duration
- Carbon impact from equipment and facility energy usage

### Food Calculations
- Standard emission factors by food category
- Vegetarian: ~1.5 kg CO₂/day
- Non-vegetarian: ~3.5 kg CO₂/day
- Vegan: ~1.0 kg CO₂/day
- Adjusted by quantity and meal frequency

### Travel Calculations
- **Petrol Car**: 0.12 kg CO₂/km
- **Diesel Car**: 0.15 kg CO₂/km
- **Electric Vehicle**: 0.05 kg CO₂/km
- **Public Transport**: 0.04 kg CO₂/km
- **Walking/Cycling**: 0 kg CO₂/km
- Fuel cost calculations based on mileage and fuel prices

### GPS Distance Calculation
- Haversine formula for accurate distance between GPS coordinates
- Real-time tracking with high accuracy
- Automatic waypoint recording

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Footer component
│   ├── ui/                     # shadcn/ui components
│   └── ProtectedRoute.tsx      # Route guard component
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Register.tsx            # Registration page
│   ├── Dashboard.tsx           # Main dashboard
│   ├── Profile.tsx             # User profile
│   ├── Exercise.tsx            # Exercise tracking
│   ├── Food.tsx                # Food tracking
│   ├── Travel.tsx              # Manual travel tracking
│   ├── RealtimeTracking.tsx    # GPS tracking
│   ├── History.tsx             # Activity history
│   └── Analytics.tsx           # Analytics dashboard
├── services/
│   ├── storage.ts              # localStorage service
│   └── calculations.ts         # Calculation logic
├── types/
│   └── index.ts                # TypeScript type definitions
├── App.tsx                     # Main app component
├── routes.tsx                  # Route configuration
└── index.css                   # Global styles

```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Build for production:
   ```bash
   pnpm run build
   ```

5. Run linting:
   ```bash
   pnpm run lint
   ```

## Usage Guide

### First Time Setup
1. Register a new account with email and password
2. Complete your profile with personal information
3. Start tracking activities from the dashboard

### Tracking Exercise
1. Navigate to Exercise page
2. Select exercise type, duration, and intensity
3. Click "Calculate Impact"
4. Review results and apply suggestions if desired

### Tracking Food
1. Navigate to Food page
2. Select food category, type, quantity, and meal frequency
3. Click "Calculate Emissions"
4. View emission breakdown and suggestions

### Manual Travel Tracking
1. Navigate to Travel page
2. Enter mode, distance, fuel type, and vehicle details
3. Click "Calculate Impact"
4. Review carbon emissions and costs

### Real-Time GPS Tracking
1. Navigate to GPS Tracking page
2. Set up vehicle details
3. Grant location permissions
4. Click "Start Tracking"
5. Monitor live stats during journey
6. Click "Stop & Save Trip" when finished

### Viewing History & Analytics
1. Navigate to History page to see all activities
2. Use filters to find specific activities
3. Navigate to Analytics page for visualizations
4. Review daily, weekly, and monthly trends

## Data Storage

**Important Note**: This application currently uses browser localStorage for data storage. This means:
- Data is stored locally in your browser
- Data persists across sessions
- Data is not synced across devices
- Clearing browser data will delete all records

For production deployment with cloud database (Supabase), please contact Miaoda official support.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**GPS Tracking Requirements**:
- HTTPS connection (required for Geolocation API)
- Location permissions granted
- Modern browser with Geolocation API support

## Security Features

- Password hashing with SHA-256
- Secure session management
- User-specific data isolation
- Protected routes requiring authentication
- Input validation and sanitization

## Future Enhancements

### Planned Features
- Multilingual support (English, Spanish, French, German, Hindi, Chinese)
- Social features (share achievements, challenge friends)
- Integration with fitness trackers (Fitbit, Apple Health)
- Carbon offset marketplace
- Community leaderboards
- AI-powered personalized recommendations
- Export data functionality (PDF, CSV)
- Dark mode support

### Database Migration
For production deployment with persistent cloud storage:
- Migrate from localStorage to Supabase
- Implement Row Level Security (RLS)
- Add real-time data synchronization
- Enable cross-device access
- Implement data backup and recovery

## Hackathon Advantages

### Innovation
- **Real-Time GPS Tracking**: Automatic distance and emission calculation
- **Instant Alternatives**: One-click greener options with immediate results
- **Holistic Approach**: Complete carbon footprint across all daily activities

### Usability
- Clean, intuitive interface with minimal learning curve
- Mobile-responsive design for on-the-go tracking
- User-friendly error messages and guidance

### Social Impact
- Empowers behavioral change through data-driven insights
- Shows direct financial benefits of reducing emissions
- Scalable architecture for future expansion

### Technical Excellence
- Modern React + TypeScript architecture
- Robust calculation methodology
- Secure authentication system
- Comprehensive data visualization

## Contributing

This is a hackathon project. For production deployment or contributions, please contact the development team.

## License

Copyright 2025 Carbon Wallet

## Support

For technical support or questions about production deployment with Supabase, please contact Miaoda official support.

---

**Built with ❤️ for a sustainable future** 🌱
