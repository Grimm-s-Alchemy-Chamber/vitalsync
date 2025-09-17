import { User, ChatMessage, Meal, Workout } from '../types';
import { mockMeals, mockWorkouts, mockChatMessages } from './mockData';
import { AIPreferenceExtractor } from './aiPreferenceExtractor';
import { PreferenceLearnedEvent } from '../types/preferences';

// Mock AI responses for different input types
const aiResponses = {
  food: [
    "I've logged that meal for you! That sounds delicious and nutritious.",
    "Great choice! I've added it to your meal log with estimated calories and macros.",
    "Logged! That meal fits well with your fitness goals.",
    "Added to your nutrition log! Keep up the healthy eating habits.",
  ],
  workout: [
    "Awesome workout! I've logged it in your gym section.",
    "Great job on that workout! All sets and reps are recorded.",
    "Logged your workout! You're making excellent progress.",
    "That workout is now in your fitness log. Keep up the momentum!",
  ],
  general: [
    "I'm here to help with your fitness journey! What would you like to track?",
    "How can I assist you with your health and fitness goals today?",
    "I can help you log meals, workouts, or answer fitness questions. What's up?",
    "Ready to help you stay on track with your fitness goals!",
  ],
};

// Store for preference learned events
let preferenceLearnedEvents: PreferenceLearnedEvent[] = [];

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    // Mock login - always successful for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: '1',
      name: 'Demo User',
      email,
      height: 175,
      weight: 70,
      age: 28,
      gender: 'male',
      goal: 'maintain',
      activityLevel: 'moderate',
      createdAt: new Date(),
    };
  },

  async register(userData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now().toString(),
      name: userData.name || 'User',
      email: userData.email || '',
      height: userData.height || 170,
      weight: userData.weight || 70,
      age: userData.age || 25,
      gender: userData.gender || 'male',
      goal: userData.goal || 'maintain',
      activityLevel: userData.activityLevel || 'moderate',
      createdAt: new Date(),
    };
  },
};

export const chatService = {
  async sendMessage(message: string): Promise<ChatMessage & { learnedPreferences?: PreferenceLearnedEvent[] }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract preferences from the message
    const learnedPreferences = await AIPreferenceExtractor.extractPreferences(message);
    
    // Store learned events for notifications
    preferenceLearnedEvents.push(...learnedPreferences);
    
    // Determine message type based on content
    let type: ChatMessage['type'] = 'general';
    if (message.toLowerCase().includes('eat') || message.toLowerCase().includes('meal') || 
        message.toLowerCase().includes('food') || message.toLowerCase().includes('calories')) {
      type = 'food';
    } else if (message.toLowerCase().includes('workout') || message.toLowerCase().includes('exercise') || 
               message.toLowerCase().includes('gym') || message.toLowerCase().includes('train')) {
      type = 'workout';
    }

    // Get AI context for more personalized responses
    const aiContext = await AIPreferenceExtractor.generateAIContext();
    
    // Get random response based on type
    const responses = aiResponses[type];
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Enhance response with preference context if available
    if (learnedPreferences.length > 0) {
      const preferenceMessages = learnedPreferences.map(p => p.message).join('. ');
      response += ` ${preferenceMessages}`;
    }

    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
      type,
    };

    return {
      ...chatMessage,
      learnedPreferences: learnedPreferences.length > 0 ? learnedPreferences : undefined,
    };
  },

  getChatHistory(): ChatMessage[] {
    return mockChatMessages;
  },

  getRecentLearnedPreferences(): PreferenceLearnedEvent[] {
    return preferenceLearnedEvents.slice(-5); // Return last 5 learned preferences
  },

  clearLearnedPreferences(): void {
    preferenceLearnedEvents = [];
  },
};

export const mealService = {
  getMeals(date?: Date): Meal[] {
    if (!date) return mockMeals;
    return mockMeals.filter(meal => 
      meal.date.toDateString() === date.toDateString()
    );
  },

  async addMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...meal,
      id: Date.now().toString(),
    };
  },
};

export const workoutService = {
  getWorkouts(date?: Date): Workout[] {
    if (!date) return mockWorkouts;
    return mockWorkouts.filter(workout => 
      workout.date.toDateString() === date.toDateString()
    );
  },

  async addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...workout,
      id: Date.now().toString(),
    };
  },
};