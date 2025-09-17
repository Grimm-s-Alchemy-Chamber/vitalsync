import { Medicine, MedicineReminder, MedicineSchedule, MedicineStats, MedicineInteraction } from '../types/medicine';

// Mock data for development
let mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Vitamin D3',
    dosage: '1000',
    unit: 'units',
    frequency: 'once_daily',
    timing: 'with_meal',
    mealType: 'breakfast',
    timingOffset: 0,
    reminderTimes: ['08:00'],
    startDate: new Date('2024-01-01'),
    isActive: true,
    notes: 'Take with breakfast for better absorption',
    createdAt: new Date('2024-01-01'),
    missedDoses: 2,
    totalDoses: 30,
  },
  {
    id: '2',
    name: 'Omega-3',
    dosage: '2',
    unit: 'capsules',
    frequency: 'twice_daily',
    timing: 'after_meal',
    mealType: 'any_meal',
    timingOffset: 30,
    reminderTimes: ['08:30', '20:30'],
    startDate: new Date('2024-01-01'),
    isActive: true,
    notes: 'Take 30 minutes after meals to reduce stomach upset',
    sideEffects: ['Fishy aftertaste', 'Mild stomach upset'],
    createdAt: new Date('2024-01-01'),
    missedDoses: 1,
    totalDoses: 60,
  },
];

let mockReminders: MedicineReminder[] = [];
let mockSchedule: MedicineSchedule = {
  id: '1',
  userId: '1',
  medicines: mockMedicines,
  dailyReminders: mockReminders,
  preferences: {
    reminderSound: true,
    vibration: true,
    snoozeMinutes: 10,
    maxSnoozes: 3,
    quietHours: {
      start: '22:00',
      end: '07:00',
    },
  },
  lastUpdated: new Date(),
};

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const medicineApi = {
  /**
   * Get all medicines for the user
   */
  async getMedicines(): Promise<Medicine[]> {
    await simulateApiDelay();
    return mockMedicines.filter(med => med.isActive);
  },

  /**
   * Add a new medicine
   */
  async addMedicine(medicine: Omit<Medicine, 'id' | 'createdAt' | 'missedDoses' | 'totalDoses'>): Promise<Medicine> {
    await simulateApiDelay(300);
    
    const newMedicine: Medicine = {
      ...medicine,
      id: Date.now().toString(),
      createdAt: new Date(),
      missedDoses: 0,
      totalDoses: 0,
    };
    
    mockMedicines.push(newMedicine);
    mockSchedule.medicines = mockMedicines;
    mockSchedule.lastUpdated = new Date();
    
    return newMedicine;
  },

  /**
   * Update an existing medicine
   */
  async updateMedicine(medicineId: string, updates: Partial<Medicine>): Promise<Medicine> {
    await simulateApiDelay(300);
    
    const index = mockMedicines.findIndex(med => med.id === medicineId);
    if (index === -1) {
      throw new Error('Medicine not found');
    }
    
    mockMedicines[index] = { ...mockMedicines[index], ...updates };
    mockSchedule.lastUpdated = new Date();
    
    return mockMedicines[index];
  },

  /**
   * Delete a medicine
   */
  async deleteMedicine(medicineId: string): Promise<void> {
    await simulateApiDelay(200);
    
    const index = mockMedicines.findIndex(med => med.id === medicineId);
    if (index !== -1) {
      mockMedicines[index].isActive = false;
      mockSchedule.lastUpdated = new Date();
    }
  },

  /**
   * Get today's reminders
   */
  async getTodaysReminders(): Promise<MedicineReminder[]> {
    await simulateApiDelay();
    
    const today = new Date();
    const todayStr = today.toDateString();
    
    // Generate reminders for today based on medicine schedules
    const todaysReminders: MedicineReminder[] = [];
    
    for (const medicine of mockMedicines.filter(med => med.isActive)) {
      for (const timeStr of medicine.reminderTimes) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const reminderTime = new Date(today);
        reminderTime.setHours(hours, minutes, 0, 0);
        
        if (reminderTime.toDateString() === todayStr) {
          todaysReminders.push({
            id: `${medicine.id}-${timeStr}-${todayStr}`,
            medicineId: medicine.id,
            scheduledTime: reminderTime,
            status: reminderTime < new Date() ? 'missed' : 'pending',
            createdAt: new Date(),
          });
        }
      }
    }
    
    return todaysReminders.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  },

  /**
   * Mark a reminder as taken
   */
  async markReminderTaken(reminderId: string, actualTime?: Date): Promise<void> {
    await simulateApiDelay(200);
    
    const reminder = mockReminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.status = 'taken';
      reminder.actualTime = actualTime || new Date();
      
      // Update medicine stats
      const medicine = mockMedicines.find(med => med.id === reminder.medicineId);
      if (medicine) {
        medicine.totalDoses += 1;
        medicine.lastTaken = reminder.actualTime;
      }
    }
  },

  /**
   * Mark a reminder as missed
   */
  async markReminderMissed(reminderId: string): Promise<void> {
    await simulateApiDelay(200);
    
    const reminder = mockReminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.status = 'missed';
      
      // Update medicine stats
      const medicine = mockMedicines.find(med => med.id === reminder.medicineId);
      if (medicine) {
        medicine.missedDoses += 1;
      }
    }
  },

  /**
   * Get medicine statistics
   */
  async getMedicineStats(medicineId: string): Promise<MedicineStats> {
    await simulateApiDelay();
    
    const medicine = mockMedicines.find(med => med.id === medicineId);
    if (!medicine) {
      throw new Error('Medicine not found');
    }
    
    const adherenceRate = medicine.totalDoses > 0 
      ? ((medicine.totalDoses - medicine.missedDoses) / medicine.totalDoses) * 100 
      : 100;
    
    return {
      adherenceRate: Math.round(adherenceRate),
      totalDoses: medicine.totalDoses,
      takenDoses: medicine.totalDoses - medicine.missedDoses,
      missedDoses: medicine.missedDoses,
      streakDays: 5, // Mock data
      lastWeekAdherence: [100, 100, 80, 100, 100, 60, 100], // Mock data for last 7 days
    };
  },

  /**
   * Check for medicine interactions
   */
  async checkInteractions(medicineNames: string[]): Promise<MedicineInteraction[]> {
    await simulateApiDelay();
    
    // Mock interaction data
    const interactions: MedicineInteraction[] = [];
    
    if (medicineNames.includes('Warfarin') && medicineNames.includes('Aspirin')) {
      interactions.push({
        id: '1',
        medicine1: 'Warfarin',
        medicine2: 'Aspirin',
        severity: 'severe',
        description: 'Increased risk of bleeding',
        recommendation: 'Consult your doctor before taking these together',
      });
    }
    
    return interactions;
  },

  /**
   * Get medicine schedule
   */
  async getSchedule(): Promise<MedicineSchedule> {
    await simulateApiDelay();
    return mockSchedule;
  },

  /**
   * Update schedule preferences
   */
  async updateSchedulePreferences(preferences: Partial<MedicineSchedule['preferences']>): Promise<void> {
    await simulateApiDelay(200);
    
    mockSchedule.preferences = {
      ...mockSchedule.preferences,
      ...preferences,
    };
    mockSchedule.lastUpdated = new Date();
  },
};