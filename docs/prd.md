# Carbon Wallet Website Requirements Document

## 1. Project Overview

### 1.1 Application Name
Carbon Wallet\n
### 1.2 Application Description
Carbon Wallet is a professional web-based platform designed to help individual users track, understand, and reduce their carbon footprint and associated costs through daily activities including exercise, food consumption, and travel behavior. The platform uses simplified emission factors to provide actionable insights and greener alternatives.

### 1.3 Core Problem Statement
Individuals lack accessible tools to understand how their daily activities (exercise, food intake, travel) impact carbon emissions and personal spending. Carbon Wallet bridges this gap by providing real-time tracking, automated calculations, and actionable suggestions for reducing environmental impact and costs.

### 1.4 Target Audience
- Students seeking to understand their environmental impact
- Daily commuters looking to optimize travel costs and emissions
- Health-conscious individuals tracking fitness and sustainability\n- Environment-aware citizens committed to reducing carbon footprint

**Note:** This platform is strictly for individual users, not corporate entities.

---

## 2. Core Functional Modules

### 2.1 Authentication System

#### 2.1.1 User Registration\n- Input fields: Full name, email address, password, confirm password
- Password requirements: Minimum 8 characters, including letters and numbers
- Email verification process
- Secure password hashing before storage
\n#### 2.1.2 User Login
- Input fields: Email, password
- Session/token-based authentication
- 'Remember me' option
- Password recovery via email

#### 2.1.3 Security Features
- Encrypted password storage
- Session management with timeout
- User-specific data isolation
- Secure logout functionality

---

### 2.2 User Profile Module

#### 2.2.1 Profile Information
- Age (years)
- Gender (Male/Female/Other)
- Height (cm)
- Weight (kg)
- Activity level (Sedentary/Lightly Active/Moderately Active/Very Active)
\n#### 2.2.2 Profile Management
- Editable profile fields
- Profile photo upload (optional)
- Data used for personalized calorie and carbon calculations
- Save and update functionality

---\n
### 2.3 Exercise Module

#### 2.3.1 Input Fields
- Exercise type: Walking, Running, Cycling, Gym, Yoga
- Duration: Minutes (numeric input)
- Intensity level: Low, Moderate, High\n- Frequency: Days per week (1-7)

#### 2.3.2 Output Calculations
- Calories burned (based on user profile and activity)
- Estimated weight change (weekly/monthly projection)
- Carbon impact from exercise (equipment usage, facility energy)\n- Visual progress indicators

#### 2.3.3 Display Format
- Summary cards showing key metrics
- Weekly and monthly trends
- Comparison with previous periods
\n---

### 2.4 Food Intake Module

#### 2.4.1 Input Fields
- Food category: Vegetarian, Non-vegetarian, Vegan
- Food type: Rice, Wheat, Dairy, Meat, Processed foods
- Quantity: Small, Medium, Large
- Meals per day: 1-6

#### 2.4.2 Output Calculations\n- Daily food carbon emission (kg CO2)
- Weekly food emission estimate\n- Monthly food emission estimate
- Carbon intensity comparison by food type

#### 2.4.3 Visualization
- Pie charts showing emission breakdown by food category
- Daily/weekly/monthly trend graphs
- Comparison with average user data

---
\n### 2.5 Manual Travel Module

#### 2.5.1 Input Fields
- Mode of travel: Car, Bike, Public Transport, Train, Walk
- Total kilometers travelled (numeric input)
- Fuel type: Petrol, Diesel, Electric, None (for walking/cycling)
- Vehicle age: Years (numeric input)
- Mileage range: Low (5-10 km/l), Medium (10-15 km/l), High (15+ km/l)

#### 2.5.2 Output Calculations
- Carbon emitted (kg CO2)
- Estimated money spent on fuel (local currency)
- Cost per kilometer\n- Emission per kilometer

#### 2.5.3 Display Features
- Trip summary cards
- Cost and emission breakdown
- Monthly travel statistics
\n---

### 2.6 Alternative Suggestions Engine

#### 2.6.1 Suggestion Logic
After every calculation (exercise, food, travel), the system automatically:
- Analyzes current choices
- Identifies greener alternatives (e.g., public transport instead of car, cycling instead of driving)
- Calculates potential savings in carbon and cost
\n#### 2.6.2 User Interaction
- Display alternative options with estimated reductions
- 'Apply Suggestion' button for each alternative
- Instant recalculation showing:\n  - Reduced carbon emission
  - Reduced cost
  - Percentage improvement

#### 2.6.3 Examples
- Travel:'Switch from car to public transport: Save 2.5 kg CO2 and $5'\n- Food: 'Replace one meat meal with vegetarian: Save 1.2 kg CO2 per day'
\n---

### 2.7 Real-Time Data Tracking Module (Core Innovation)

#### 2.7.1 Setup Process
Before starting real-time tracking, user inputs:
- Vehicle type (Car/Bike/Scooter)
- Fuel type (Petrol/Diesel/Electric)
- Vehicle age (years)
\n#### 2.7.2 Tracking Mechanism
- Request GPS location permission
- Start tracking button initiates continuous monitoring
- Automatic distance calculation using GPS coordinates
- Time tracking from start to stop
- Detects stops and slow speeds (traffic, signals)\n- No manual input required during journey

#### 2.7.3 Automatic Outputs
- Total distance travelled (km)
- Journey duration (minutes)
- Carbon emitted (kg CO2)
- Money spent on fuel (calculated from distance and mileage)
- Average speed\n\n#### 2.7.4 User Controls
- Start tracking button
- Pause/resume functionality
- Stop and save trip\n- View live stats during journey
\n---

### 2.8 Smart Alerts & Notifications
\n#### 2.8.1 Alert Types
- High carbon-emission area warnings (based on traffic density, pollution data)
- Real-time carbon spike notifications during travel
- Daily/weekly emission threshold alerts
- Milestone achievements (e.g., '100 kg CO2 saved this month')

#### 2.8.2 Suggestion Prompts
- Immediate alternative route suggestions
- Public transport availability nearby
- Carpooling recommendations
\n#### 2.8.3 Notification Settings
- User-configurable alert preferences
- Push notifications (if mobile browser supports)
- In-app notification center

---
\n### 2.9 History & Analytics Module

#### 2.9.1 Data Storage
- All manual entries (exercise, food, travel)\n- All real-time tracking sessions
- Date and time stamps
- Carbon and cost results for each activity

#### 2.9.2 History View
- Chronological list of all activities
- Filter by date range
- Filter by activity type (exercise/food/travel)
- Search functionality

#### 2.9.3 Analytics Dashboard
- Daily summary: Total carbon, total cost, activities logged
- Weekly comparison: Current week vs. previous week
- Monthly trends: Line graphs showing emission patterns
- Progress tracking: Goals vs. actual performance
- Best and worst days highlighted

#### 2.9.4 Visualization Tools
- Bar charts for daily/weekly comparisons
- Line graphs for monthly trends
- Pie charts for emission breakdown by category
- Progress bars for goal achievement

---

## 3. Database Design
\n### 3.1 Users Table
- user_id (Primary Key, Auto-increment)
- name (VARCHAR)\n- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- age (INT)
- gender (VARCHAR)
- height (FLOAT)
- weight (FLOAT)\n- activity_level (VARCHAR)\n- profile_photo (VARCHAR, optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 3.2 Activity_History Table
- activity_id (Primary Key, Auto-increment)
- user_id (Foreign Key → Users.user_id)
- activity_type (ENUM: 'exercise', 'food', 'manual_travel', 'realtime_travel')
- activity_date (DATE)
- activity_time (TIME)
- input_data (JSON: stores all input parameters)
- carbon_emitted (FLOAT, kg CO2)
- cost_spent (FLOAT, currency)
- distance_travelled (FLOAT, km, nullable)
- duration (INT, minutes, nullable)
- alternative_applied (BOOLEAN)\n- created_at (TIMESTAMP)
\n### 3.3 Relationships
- One user can have multiple activity records (One-to-Many)
- Activity history linked to user via user_id
\n---

## 4. Multilingual Support

### 4.1 Language Selection
- Language picker on first visit (homepage)
- Supported languages: English, Spanish, French, German, Hindi, Chinese (expandable)
- User preference saved in profile

### 4.2 Language Switching
- Language dropdown in header/navigation bar
- Instant UI language change without page reload
- Consistent terminology across all pages

### 4.3 Implementation
- Internationalization (i18n) framework
- Translation files for each language
- Dynamic content rendering based on selected language
\n---

## 5. UI/UX & Design Requirements

### 5.1 Design Style
- Color scheme: Eco-friendly palette with primary green (#2ECC71), secondary blue (#3498DB), neutral grays, and white backgrounds for clean contrast
- Visual details: Soft rounded corners (8px radius), subtle shadows for depth, minimalist icons with nature-inspired elements
- Layout: Card-based modular design with clear visual hierarchy, responsive grid system adapting seamlessly from mobile to desktop
- Interactive elements: Smooth transitions on hover and click, animated progress indicators, real-time updating charts with gentle animations

### 5.2 Responsive Design
- Mobile-first approach\n- Breakpoints: Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px)
- Touch-friendly buttons and inputs on mobile
- Optimized navigation for small screens

### 5.3 Form Design
- Clear labels and placeholders
- Input validation with real-time feedback
- Error messages displayed inline\n- Success confirmations with visual cues

### 5.4 Dashboard Layout
- Quick insights section at top (today's carbon, cost, activities)
- Module cards for easy navigation (Exercise, Food, Travel, Real-Time Tracking)
- Recent activity feed
- Alerts and notifications panel

### 5.5 Accessibility\n- High contrast text for readability
- Keyboard navigation support
- Screen reader compatible
- Alt text for all images and icons

---
\n## 6. Hackathon Advantage Section

### 6.1 Key Advantages of Carbon Wallet
\n#### Innovation\n- **Real-Time GPS Tracking:** Unlike static calculators, Carbon Wallet offers live tracking with automatic distance and emission calculation—no manual input needed during travel.
- **Instant Alternative Suggestions:** After every calculation, users receive actionable greener alternatives with one-click application and instant recalculation.
- **Holistic Approach:** Combines exercise, food, and travel in one platform, providing a complete picture of personal carbon footprint.

#### Usability
- **User-Friendly Interface:** Clean, intuitive design with minimal learning curve.
- **Multilingual Support:** Accessible to global audience, breaking language barriers.
- **Mobile-Responsive:** Works seamlessly on any device, enabling on-the-go tracking.
\n#### Social Impact
- **Behavioral Change:** Empowers individuals with data to make informed, sustainable choices daily.
- **Cost Savings:** Shows direct financial benefits of reducing carbon emissions, motivating continued use.
- **Scalability:** Designed for individual users now, but architecture supports future expansion to communities and organizations.

#### Technical Excellence
- **Secure Authentication:** Industry-standard password hashing and session management.
- **Robust Database Design:** Efficient data storage with user isolation and scalability.
- **Real-Time Alerts:** Smart notifications based on location and emission patterns.

### 6.2 Why Carbon Wallet Stands Out
- **Comprehensive Tracking:** Most carbon calculators focus on one area (travel or food). Carbon Wallet integrates all major daily activities.
- **Automation:** Real-time GPS tracking eliminates manual data entry, increasing accuracy and user engagement.
- **Actionable Insights:** Not just data—users get specific, implementable suggestions with measurable impact.
- **Personal Relevance:** Calculations tailored to individual profiles (age, weight, activity level) for accurate results.

### 6.3 Why Judges Should Consider This a Winning Project
- **Addresses Real Problem:** Climate change is urgent; Carbon Wallet makes sustainability personal and achievable.
- **Fully Implementable:** Every feature described is technically feasible with current web technologies (HTML5, CSS3, JavaScript, GPS API, backend frameworks).
- **User-Centric Design:** Prioritizes ease of use and engagement, ensuring adoption and long-term impact.
- **Measurable Impact:** Users can track progress over time, demonstrating tangible environmental and financial benefits.
- **Hackathon-Ready:** Complete specification with clear modules, database design, and UI/UX guidelines—ready for rapid prototyping and presentation.

---
\n## 7. Implementation Notes

### 7.1 Technology Stack (Suggested)
- **Frontend:** HTML5, CSS3, JavaScript (React or Vue.js for dynamic UI)
- **Backend:** Node.js with Express, or Python with Flask/Django
- **Database:** PostgreSQL or MySQL
- **Authentication:** JWT (JSON Web Tokens) or session-based
- **GPS Tracking:** HTML5 Geolocation API\n- **Charts:** Chart.js or D3.js for data visualization
- **Hosting:** Cloud platform (AWS, Google Cloud, Heroku)

### 7.2 Calculation Methodology
- Use standard average emission factors (e.g., 0.12 kg CO2 per km for petrol cars, 0.4 kg CO2 per kg of beef)
- Calorie calculations based on MET (Metabolic Equivalent of Task) values
- Fuel cost based on average local prices (user can customize)
\n### 7.3 Future Enhancements (Post-Hackathon)
- Social features: Share achievements, challenge friends
- Integration with fitness trackers (Fitbit, Apple Health)
- Carbon offset marketplace\n- Community leaderboards
- AI-powered personalized recommendations

---

## 8. Summary

Carbon Wallet is a production-ready, multilingual web platform that empowers individuals to track and reduce their carbon footprint across exercise, food, and travel. With innovative real-time GPS tracking, instant alternative suggestions, and comprehensive analytics, it stands out as a user-centric, impactful solution for sustainable living. The platform is designed for hackathon success with clear functionality, robust technical architecture, and measurable social impact.