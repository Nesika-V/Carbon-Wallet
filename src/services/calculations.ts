import type {
  ExerciseInput,
  ExerciseOutput,
  FoodInput,
  FoodOutput,
  TravelInput,
  TravelOutput,
  UserProfile,
  AlternativeSuggestion,
  ActivityType,
} from '@/types';

const MET_VALUES = {
  walking: { low: 2.5, moderate: 3.5, high: 4.5 },
  running: { low: 6.0, moderate: 8.0, high: 10.0 },
  cycling: { low: 4.0, moderate: 6.8, high: 10.0 },
  gym: { low: 3.0, moderate: 5.0, high: 8.0 },
  yoga: { low: 2.0, moderate: 3.0, high: 4.0 },
};

const EXERCISE_CARBON_FACTOR = 0.05;

const FOOD_CARBON_FACTORS = {
  vegetarian: {
    rice: { small: 0.3, medium: 0.5, large: 0.8 },
    wheat: { small: 0.25, medium: 0.4, large: 0.6 },
    dairy: { small: 0.4, medium: 0.7, large: 1.0 },
    meat: { small: 0, medium: 0, large: 0 },
    processed: { small: 0.5, medium: 0.8, large: 1.2 },
  },
  non_vegetarian: {
    rice: { small: 0.3, medium: 0.5, large: 0.8 },
    wheat: { small: 0.25, medium: 0.4, large: 0.6 },
    dairy: { small: 0.4, medium: 0.7, large: 1.0 },
    meat: { small: 1.5, medium: 2.5, large: 4.0 },
    processed: { small: 0.8, medium: 1.2, large: 1.8 },
  },
  vegan: {
    rice: { small: 0.25, medium: 0.4, large: 0.6 },
    wheat: { small: 0.2, medium: 0.35, large: 0.5 },
    dairy: { small: 0, medium: 0, large: 0 },
    meat: { small: 0, medium: 0, large: 0 },
    processed: { small: 0.4, medium: 0.6, large: 0.9 },
  },
};

const TRAVEL_CARBON_FACTORS = {
  car: {
    petrol: 0.12,
    diesel: 0.15,
    electric: 0.05,
    none: 0,
  },
  bike: {
    petrol: 0.08,
    diesel: 0.1,
    electric: 0.03,
    none: 0,
  },
  public_transport: {
    petrol: 0.04,
    diesel: 0.05,
    electric: 0.02,
    none: 0,
  },
  train: {
    petrol: 0.03,
    diesel: 0.04,
    electric: 0.015,
    none: 0,
  },
  walk: {
    petrol: 0,
    diesel: 0,
    electric: 0,
    none: 0,
  },
};

const FUEL_COSTS = {
  petrol: 1.5,
  diesel: 1.4,
  electric: 0.3,
  none: 0,
};

const MILEAGE_VALUES = {
  low: 7.5,
  medium: 12.5,
  high: 17.5,
};

export const calculationService = {
  calculateExercise(input: ExerciseInput, profile?: UserProfile): ExerciseOutput {
    const weight = profile?.weight || 70;
    const met = MET_VALUES[input.type][input.intensity];
    const caloriesBurned = (met * weight * input.duration) / 60;
    const weeklyCalories = caloriesBurned * input.frequency;
    const weightChange = (weeklyCalories * 4) / 7700;
    const carbonImpact = input.duration * EXERCISE_CARBON_FACTOR;

    return {
      caloriesBurned: Math.round(caloriesBurned),
      weightChange: Number(weightChange.toFixed(2)),
      carbonImpact: Number(carbonImpact.toFixed(2)),
    };
  },

  calculateFood(input: FoodInput): FoodOutput {
    const emissionPerMeal =
      FOOD_CARBON_FACTORS[input.category][input.foodType][input.quantity];
    const dailyEmission = emissionPerMeal * input.mealsPerDay;
    const weeklyEmission = dailyEmission * 7;
    const monthlyEmission = dailyEmission * 30;

    return {
      dailyEmission: Number(dailyEmission.toFixed(2)),
      weeklyEmission: Number(weeklyEmission.toFixed(2)),
      monthlyEmission: Number(monthlyEmission.toFixed(2)),
    };
  },

  calculateTravel(input: TravelInput): TravelOutput {
    const carbonFactor = TRAVEL_CARBON_FACTORS[input.mode][input.fuelType];
    const carbonEmitted = carbonFactor * input.distance;

    let moneySpent = 0;
    if (input.fuelType !== 'none' && input.mileage) {
      const mileageValue = MILEAGE_VALUES[input.mileage];
      const fuelConsumed = input.distance / mileageValue;
      moneySpent = fuelConsumed * FUEL_COSTS[input.fuelType];

      if (input.vehicleAge && input.vehicleAge > 5) {
        moneySpent *= 1 + (input.vehicleAge - 5) * 0.05;
      }
    }

    const costPerKm = input.distance > 0 ? moneySpent / input.distance : 0;
    const emissionPerKm = input.distance > 0 ? carbonEmitted / input.distance : 0;

    return {
      carbonEmitted: Number(carbonEmitted.toFixed(2)),
      moneySpent: Number(moneySpent.toFixed(2)),
      costPerKm: Number(costPerKm.toFixed(2)),
      emissionPerKm: Number(emissionPerKm.toFixed(3)),
    };
  },

  generateExerciseSuggestion(input: ExerciseInput, output: ExerciseOutput): AlternativeSuggestion | null {
    if (input.intensity === 'high') return null;

    const newIntensity = input.intensity === 'low' ? 'moderate' : 'high';
    const newOutput = this.calculateExercise({ ...input, intensity: newIntensity });

    return {
      type: 'exercise',
      currentChoice: `${input.type} (${input.intensity} intensity)`,
      alternative: `${input.type} (${newIntensity} intensity)`,
      carbonSaved: 0,
      costSaved: 0,
      percentageImprovement: ((newOutput.caloriesBurned - output.caloriesBurned) / output.caloriesBurned) * 100,
    };
  },

  generateFoodSuggestion(input: FoodInput, output: FoodOutput): AlternativeSuggestion | null {
    if (input.category === 'vegan') return null;

    const newCategory = input.category === 'non_vegetarian' ? 'vegetarian' : 'vegan';
    const newOutput = this.calculateFood({ ...input, category: newCategory });
    const carbonSaved = output.dailyEmission - newOutput.dailyEmission;

    if (carbonSaved <= 0) return null;

    return {
      type: 'food',
      currentChoice: `${input.category} diet`,
      alternative: `${newCategory} diet`,
      carbonSaved: Number(carbonSaved.toFixed(2)),
      costSaved: 0,
      percentageImprovement: (carbonSaved / output.dailyEmission) * 100,
    };
  },

  generateTravelSuggestion(input: TravelInput, output: TravelOutput): AlternativeSuggestion | null {
    if (input.mode === 'walk' || input.mode === 'public_transport') return null;

    let alternative: TravelInput['mode'] = 'public_transport';
    let alternativeLabel = 'Public Transport';

    if (input.distance < 5) {
      alternative = 'walk';
      alternativeLabel = 'Walking';
    }

    const newOutput = this.calculateTravel({
      ...input,
      mode: alternative,
      fuelType: alternative === 'walk' ? 'none' : input.fuelType,
    });

    const carbonSaved = output.carbonEmitted - newOutput.carbonEmitted;
    const costSaved = output.moneySpent - newOutput.moneySpent;

    if (carbonSaved <= 0) return null;

    return {
      type: 'manual_travel',
      currentChoice: `${input.mode}`,
      alternative: alternativeLabel,
      carbonSaved: Number(carbonSaved.toFixed(2)),
      costSaved: Number(costSaved.toFixed(2)),
      percentageImprovement: (carbonSaved / output.carbonEmitted) * 100,
    };
  },

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  },
};
