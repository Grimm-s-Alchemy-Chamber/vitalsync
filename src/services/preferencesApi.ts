import { UserPreferences, PreferenceUpdate, CustomFood } from '../types/preferences';

// Mock API endpoints - replace with actual API calls in production
const API_BASE_URL = '/api/preferences';

// In-memory storage for development - replace with actual API calls
let mockPreferences: UserPreferences | null = null;

// Initialize with minimal mock data - categories will be populated from chat
const initializeMockData = (): UserPreferences => {
  return {
    general: {
      units: 'metric',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'DD/MM/YYYY',
    },
    workout: {
      // Will be populated from chat interactions
    },
    health: {
      hydrationGoal: 2500,
      sleepGoal: 8,
      waterReminderInterval: 60,
      // Other health preferences will be populated from chat
    },
    eating: {
      mealPreparationTime: 'moderate',
      cookingSkillLevel: 'intermediate',
      budgetRange: 'medium',
      organicPreference: false,
      // Other eating preferences will be populated from chat
    },
    ingredients: {
      customFoods: {},
      // Other ingredient data will be populated from chat
    },
    lastUpdated: new Date(),
    version: '1.0.0',
  };
};

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const preferencesApi = {
  /**
   * Get all user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    await simulateApiDelay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}`, {
    //   method: 'GET',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // return response.json();
    
    if (!mockPreferences) {
      mockPreferences = initializeMockData();
      // Try to load from localStorage
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          mockPreferences = {
            ...mockPreferences,
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated),
          };
        } catch (error) {
          console.warn('Failed to parse stored preferences:', error);
        }
      }
    }
    
    return mockPreferences;
  },

  /**
   * Save a specific preference
   */
  async savePreference(
    category: keyof Omit<UserPreferences, 'lastUpdated' | 'version'>,
    key: string,
    value: any
  ): Promise<void> {
    await simulateApiDelay(200);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/${category}/${key}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ value })
    // });
    
    if (!mockPreferences) {
      mockPreferences = initializeMockData();
    }
    
    // Update the preference using dot notation
    const keys = key.split('.');
    let current: any = mockPreferences[category];
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    mockPreferences.lastUpdated = new Date();
    
    // Persist to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(mockPreferences));
  },

  /**
   * Clear a specific preference
   */
  async clearPreference(
    category: keyof Omit<UserPreferences, 'lastUpdated' | 'version'>,
    key: string
  ): Promise<void> {
    await simulateApiDelay(200);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/${category}/${key}`, {
    //   method: 'DELETE',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    
    if (!mockPreferences) {
      return;
    }
    
    const keys = key.split('.');
    let current: any = mockPreferences[category];
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        return;
      }
      current = current[keys[i]];
    }
    
    delete current[keys[keys.length - 1]];
    mockPreferences.lastUpdated = new Date();
    
    // Persist to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(mockPreferences));
  },

  /**
   * Add a custom food item
   */
  async addCustomFood(food: Omit<CustomFood, 'id' | 'lastUsed' | 'usageCount' | 'createdAt'>): Promise<CustomFood> {
    await simulateApiDelay(300);
    
    const customFood: CustomFood = {
      ...food,
      id: `${food.name.toLowerCase().replace(/\s+/g, '-')}-${food.brand?.toLowerCase().replace(/\s+/g, '-') || 'generic'}`,
      lastUsed: new Date(),
      usageCount: 1,
      createdAt: new Date(),
    };
    
    await this.savePreference('ingredients', `customFoods.${customFood.id}`, customFood);
    
    return customFood;
  },

  /**
   * Update custom food usage
   */
  async updateFoodUsage(foodId: string): Promise<void> {
    const preferences = await this.getPreferences();
    const food = preferences.ingredients.customFoods[foodId];
    
    if (food) {
      food.lastUsed = new Date();
      food.usageCount += 1;
      await this.savePreference('ingredients', `customFoods.${foodId}`, food);
    }
  },

  /**
   * Delete a custom food item
   */
  async deleteCustomFood(foodId: string): Promise<void> {
    await this.clearPreference('ingredients', `customFoods.${foodId}`);
  },

  /**
   * Batch update preferences
   */
  async batchUpdatePreferences(updates: PreferenceUpdate[]): Promise<void> {
    await simulateApiDelay(400);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/batch`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ updates })
    // });
    
    for (const update of updates) {
      await this.savePreference(update.category, update.key, update.value);
    }
  },
};