export interface User {
  id: string;
  name: string;
  email: string;
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female' | 'other';
  goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  createdAt: Date;
}

export interface MacroTargets {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
}

export interface DailyMacros {
  date: string; // YYYY-MM-DD format
  consumed: MacroTargets;
  targets: MacroTargets;
  remaining: MacroTargets;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'food' | 'workout' | 'general';
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image?: string;
}

export interface MealPreset {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image?: string;
  createdAt: Date;
  usageCount: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: Date;
  duration: number; // in minutes
  calories: number;
  notes?: string;
  images?: string[]; // Array of up to 4 image URLs
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  restTime?: number; // in seconds
  notes?: string;
}

export interface Set {
  reps: number;
  weight: number; // in kg
  completed: boolean;
}

export interface WorkoutPreset {
  id: string;
  name: string;
  exercises: PresetExercise[];
  estimatedDuration: number; // in minutes
  estimatedCalories: number;
  category?: string;
  createdAt: Date;
}

export interface PresetExercise {
  id: string;
  name: string;
  sets: PresetSet[];
  restTime?: number; // in seconds
  notes?: string;
}

export interface PresetSet {
  reps: number;
  weight?: number; // in kg - optional for presets
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

export type OnboardingStep = 'height' | 'weight' | 'age' | 'gender' | 'goal' | 'activity';
export type AppTab = 'chat' | 'meals' | 'gym' | 'profile';