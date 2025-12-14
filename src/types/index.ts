export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  profilePhoto?: string;
  updatedAt: string;
}

export type ActivityType = 'exercise' | 'food' | 'manual_travel' | 'realtime_travel';

export interface ActivityHistory {
  id: string;
  userId: string;
  activityType: ActivityType;
  activityDate: string;
  activityTime: string;
  inputData: Record<string, unknown>;
  carbonEmitted: number;
  costSpent: number;
  distanceTravelled?: number;
  duration?: number;
  alternativeApplied: boolean;
  createdAt: string;
}

export interface ExerciseInput {
  type: 'walking' | 'running' | 'cycling' | 'gym' | 'yoga';
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  frequency: number;
}

export interface ExerciseOutput {
  caloriesBurned: number;
  weightChange: number;
  carbonImpact: number;
}

export interface FoodInput {
  category: 'vegetarian' | 'non_vegetarian' | 'vegan';
  foodType: 'rice' | 'wheat' | 'dairy' | 'meat' | 'processed';
  quantity: 'small' | 'medium' | 'large';
  mealsPerDay: number;
}

export interface FoodOutput {
  dailyEmission: number;
  weeklyEmission: number;
  monthlyEmission: number;
}

export interface TravelInput {
  mode: 'car' | 'bike' | 'public_transport' | 'train' | 'walk';
  distance: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'none';
  vehicleAge?: number;
  mileage?: 'low' | 'medium' | 'high';
}

export interface TravelOutput {
  carbonEmitted: number;
  moneySpent: number;
  costPerKm: number;
  emissionPerKm: number;
}

export interface RealtimeTrackingSession {
  id: string;
  userId: string;
  vehicleType: 'car' | 'bike' | 'scooter';
  fuelType: 'petrol' | 'diesel' | 'electric';
  vehicleAge: number;
  startTime: string;
  endTime?: string;
  totalDistance: number;
  carbonEmitted: number;
  moneySpent: number;
  averageSpeed: number;
  isActive: boolean;
  waypoints: Array<{
    lat: number;
    lng: number;
    timestamp: string;
  }>;
}

export interface AlternativeSuggestion {
  type: ActivityType;
  currentChoice: string;
  alternative: string;
  carbonSaved: number;
  costSaved: number;
  percentageImprovement: number;
}
