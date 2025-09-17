import { preferencesApi } from './preferencesApi';
import { PreferenceLearnedEvent } from '../types/preferences';

interface ExtractionRule {
  pattern: RegExp;
  category: string;
  key: string;
  extractor: (match: RegExpMatchArray) => any;
  confidence: number;
  message: (value: any) => string;
}

// Define extraction rules for different types of preferences
const extractionRules: ExtractionRule[] = [
  // Brand preferences
  {
    pattern: /(?:i (?:always|usually|prefer|like|use|eat|buy) |my (?:favorite|usual|go-to) )([a-zA-Z\s]+) (paneer|oats|yogurt|protein powder|chicken|rice|bread|milk)/gi,
    category: 'ingredients',
    key: 'brandPreferences',
    extractor: (match) => ({ ingredient: match[2].toLowerCase(), brand: match[1].trim() }),
    confidence: 0.8,
    message: (value) => `Learned: Your preferred ${value.ingredient} brand is ${value.brand}`,
  },
  
  // Allergies and dietary restrictions
  {
    pattern: /(?:i'm |i am |i have )(?:allergic to|intolerant to|can't eat|cannot eat|avoid) ([a-zA-Z\s,]+)/gi,
    category: 'health',
    key: 'allergies',
    extractor: (match) => match[1].split(',').map(item => item.trim().toLowerCase()),
    confidence: 0.9,
    message: (value) => `Learned: You're allergic to ${value.join(', ')}`,
  },
  
  // Dietary restrictions
  {
    pattern: /(?:i'm |i am |i follow )(?:a )?(vegetarian|vegan|keto|paleo|low-carb|gluten-free|dairy-free)/gi,
    category: 'health',
    key: 'dietaryRestrictions',
    extractor: (match) => [match[1].toLowerCase()],
    confidence: 0.9,
    message: (value) => `Learned: You follow a ${value[0]} diet`,
  },
  
  // Favorite exercises
  {
    pattern: /(?:i love|i like|my favorite exercise is|i enjoy doing|i prefer) ([a-zA-Z\s-]+)(?:exercise|workout)?/gi,
    category: 'workout',
    key: 'favoriteExercises',
    extractor: (match) => [match[1].trim().toLowerCase()],
    confidence: 0.8,
    message: (value) => `Learned: You enjoy ${value[0]} exercises`,
  },
  
  // Disliked exercises
  {
    pattern: /(?:i hate|i don't like|i dislike|i avoid) ([a-zA-Z\s-]+)(?:exercise|workout)?/gi,
    category: 'workout',
    key: 'dislikedExercises',
    extractor: (match) => [match[1].trim().toLowerCase()],
    confidence: 0.8,
    message: (value) => `Learned: You dislike ${value[0]} exercises`,
  },
  
  // Workout duration preferences
  {
    pattern: /(?:i (?:usually|typically|prefer to) workout for|my workouts are usually|i like) (\d+) (?:minutes?|mins?)/gi,
    category: 'workout',
    key: 'preferredWorkoutDuration',
    extractor: (match) => parseInt(match[1]),
    confidence: 0.8,
    message: (value) => `Learned: You prefer ${value}-minute workouts`,
  },
  
  // Cuisine preferences
  {
    pattern: /(?:i love|i like|i enjoy|i prefer) ([a-zA-Z\s]+) (?:food|cuisine|dishes)/gi,
    category: 'eating',
    key: 'cuisines',
    extractor: (match) => [match[1].trim().toLowerCase()],
    confidence: 0.7,
    message: (value) => `Learned: You enjoy ${value[0]} cuisine`,
  },
  
  // Hydration goals
  {
    pattern: /(?:i drink|i aim for|my goal is|i try to drink) (\d+(?:\.\d+)?) (?:liters?|litres?|l) (?:of water|water)/gi,
    category: 'health',
    key: 'hydrationGoal',
    extractor: (match) => Math.round(parseFloat(match[1]) * 1000), // Convert to ml
    confidence: 0.9,
    message: (value) => `Learned: Your hydration goal is ${value}ml per day`,
  },
];

export class AIPreferenceExtractor {
  private static learnedEvents: PreferenceLearnedEvent[] = [];
  
  /**
   * Extract preferences from user message
   */
  static async extractPreferences(message: string): Promise<PreferenceLearnedEvent[]> {
    const events: PreferenceLearnedEvent[] = [];
    
    for (const rule of extractionRules) {
      const matches = Array.from(message.matchAll(rule.pattern));
      
      for (const match of matches) {
        try {
          const extractedValue = rule.extractor(match);
          
          if (extractedValue) {
            const event: PreferenceLearnedEvent = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              category: rule.category,
              key: rule.key,
              value: extractedValue,
              confidence: rule.confidence,
              message: rule.message(extractedValue),
              timestamp: new Date(),
            };
            
            events.push(event);
            this.learnedEvents.push(event);
            
            // Save the preference
            await this.saveExtractedPreference(event);
          }
        } catch (error) {
          console.warn('Failed to extract preference:', error);
        }
      }
    }
    
    return events;
  }
  
  /**
   * Save extracted preference to the preference store
   */
  private static async saveExtractedPreference(event: PreferenceLearnedEvent): Promise<void> {
    try {
      const preferences = await preferencesApi.getPreferences();
      
      if (event.category === 'ingredients' && event.key === 'brandPreferences') {
        const { ingredient, brand } = event.value;
        await preferencesApi.savePreference('ingredients', `brandPreferences.${ingredient}`, brand);
      } else if (Array.isArray(event.value)) {
        // Handle array values (allergies, dietary restrictions, etc.)
        const currentValue = this.getNestedValue(preferences, event.category, event.key) || [];
        const newItems = event.value.filter(item => !currentValue.includes(item));
        
        if (newItems.length > 0) {
          const updatedValue = [...currentValue, ...newItems];
          await preferencesApi.savePreference(event.category as any, event.key, updatedValue);
        }
      } else {
        // Handle single values
        await preferencesApi.savePreference(event.category as any, event.key, event.value);
      }
    } catch (error) {
      console.error('Failed to save extracted preference:', error);
    }
  }
  
  /**
   * Get nested value from preferences object
   */
  private static getNestedValue(obj: any, category: string, key: string): any {
    const keys = key.split('.');
    let current = obj[category];
    
    for (const k of keys) {
      if (current && typeof current === 'object') {
        current = current[k];
      } else {
        return undefined;
      }
    }
    
    return current;
  }
  
  /**
   * Get recent learned events
   */
  static getRecentLearnedEvents(limit: number = 10): PreferenceLearnedEvent[] {
    return this.learnedEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  /**
   * Clear learned events history
   */
  static clearLearnedEvents(): void {
    this.learnedEvents = [];
  }
  
  /**
   * Generate context for AI based on current preferences
   */
  static async generateAIContext(): Promise<string> {
    try {
      const preferences = await preferencesApi.getPreferences();
      
      const context = [
        '=== USER PREFERENCES CONTEXT ===',
        '',
        '🏃 WORKOUT PREFERENCES:',
        Object.entries(preferences.workout)
          .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n'),
        '',
        '🍽️ EATING PREFERENCES:',
        Object.entries(preferences.eating)
          .filter(([key]) => !['mealPreparationTime', 'cookingSkillLevel', 'budgetRange', 'organicPreference'].includes(key))
          .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n'),
        '',
        '🏥 HEALTH INFO:',
        Object.entries(preferences.health)
          .filter(([key]) => !['hydrationGoal', 'sleepGoal', 'waterReminderInterval'].includes(key))
          .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n'),
        '',
        '🥘 INGREDIENT PREFERENCES:',
        Object.entries(preferences.ingredients)
          .filter(([key]) => key !== 'customFoods')
          .map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return Object.entries(value)
                .map(([subKey, subValue]) => `- ${subKey}: ${subValue}`)
                .join('\n');
            }
            return `- ${key}: ${value}`;
          })
          .join('\n'),
        '',
        '📦 CUSTOM FOODS:',
        Object.values(preferences.ingredients.customFoods)
          .map(food => `- ${food.name} (${food.brand}): ${food.nutritionPer100g.calories}cal, ${food.nutritionPer100g.protein}g protein`)
          .join('\n'),
        '',
        '=== END CONTEXT ===',
      ].join('\n');
      
      return context;
    } catch (error) {
      console.error('Failed to generate AI context:', error);
      return '';
    }
  }
}