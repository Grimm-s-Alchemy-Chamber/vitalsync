export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  unit: 'mg' | 'ml' | 'tablets' | 'capsules' | 'drops' | 'puffs' | 'units';
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'every_other_day' | 'weekly' | 'monthly' | 'as_needed' | 'custom';
  customFrequency?: {
    times: number;
    interval: 'hours' | 'days' | 'weeks';
  };
  timing: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'anytime';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'any_meal';
  timingOffset?: number; // minutes before/after meal
  reminderTimes: string[]; // Array of time strings like "08:00", "14:00"
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  notes?: string;
  sideEffects?: string[];
  foodInteractions?: string[];
  createdAt: Date;
  lastTaken?: Date;
  missedDoses: number;
  totalDoses: number;
}

export interface MedicineReminder {
  id: string;
  medicineId: string;
  scheduledTime: Date;
  actualTime?: Date;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  mealRelated?: {
    mealType: 'breakfast' | 'lunch' | 'dinner';
    mealTime?: Date;
    timing: 'before' | 'after' | 'with';
    offsetMinutes: number;
  };
  notes?: string;
  createdAt: Date;
}

export interface MedicineSchedule {
  id: string;
  userId: string;
  medicines: Medicine[];
  dailyReminders: MedicineReminder[];
  preferences: {
    reminderSound: boolean;
    vibration: boolean;
    snoozeMinutes: number;
    maxSnoozes: number;
    quietHours: {
      start: string; // "22:00"
      end: string; // "07:00"
    };
  };
  lastUpdated: Date;
}

export interface MedicineInteraction {
  id: string;
  medicine1: string;
  medicine2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}

export interface MedicineStats {
  adherenceRate: number; // percentage
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  streakDays: number;
  lastWeekAdherence: number[];
}