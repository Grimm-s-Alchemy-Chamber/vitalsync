export interface GeneralPreferences {
  units: 'metric' | 'imperial';
  language: 'en' | 'es' | 'fr' | 'de';
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

export interface WorkoutPreferences {
  // These will be populated from chat interactions
  [key: string]: any;
}

export interface HealthPreferences {
  hydrationGoal: number; // in ml
  sleepGoal: number; // in hours
  waterReminderInterval: number; // in minutes
  // Other health preferences will be populated from chat
  [key: string]: any;
}

export interface EatingPreferences {
  mealPreparationTime: 'quick' | 'moderate' | 'elaborate';
  cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  budgetRange: 'low' | 'medium' | 'high';
  organicPreference: boolean;
  // Other eating preferences will be populated from chat
  [key: string]: any;
}

export interface CustomFood {
  id: string;
  name: string;
  description: string;
  brand?: string;
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    [key: string]: number | undefined; // Allow additional custom nutrients
  };
  servingSize: string;
  category: string;
  lastUsed: Date;
  usageCount: number;
  createdAt: Date;
}

export interface IngredientIntelligence {
  customFoods: Record<string, CustomFood>;
  // Other ingredient data will be populated from chat
  [key: string]: any;
}

export interface UserPreferences {
  general: GeneralPreferences;
  workout: WorkoutPreferences;
  health: HealthPreferences;
  eating: EatingPreferences;
  ingredients: IngredientIntelligence;
  lastUpdated: Date;
  version: string;
}

export interface PreferenceUpdate {
  category: keyof Omit<UserPreferences, 'lastUpdated' | 'version'>;
  key: string;
  value: any;
  timestamp: Date;
  source: 'manual' | 'ai_learned' | 'import';
}

export interface PreferenceLearnedEvent {
  id: string;
  category: string;
  key: string;
  value: any;
  confidence: number;
  message: string;
  timestamp: Date;
}