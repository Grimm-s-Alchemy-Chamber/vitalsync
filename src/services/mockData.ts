import { Meal, Workout, ChatMessage } from '../types';

export const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 35,
    carbs: 12,
    fat: 18,
    fiber: 8,
    sugar: 6,
    date: new Date(),
    mealType: 'lunch',
  },
  {
    id: '2',
    name: 'Oatmeal with Berries',
    calories: 280,
    protein: 8,
    carbs: 45,
    fat: 6,
    fiber: 12,
    sugar: 15,
    date: new Date(),
    mealType: 'breakfast',
  },
  {
    id: '3',
    name: 'Greek Yogurt with Almonds',
    calories: 220,
    protein: 20,
    carbs: 15,
    fat: 12,
    fiber: 3,
    sugar: 12,
    date: new Date(),
    mealType: 'snack',
  },
  {
    id: '4',
    name: 'Salmon with Quinoa',
    calories: 450,
    protein: 32,
    carbs: 35,
    fat: 22,
    fiber: 5,
    sugar: 3,
    date: new Date(Date.now() - 86400000), // Yesterday
    mealType: 'dinner',
  },
  {
    id: '5',
    name: 'Protein Smoothie',
    calories: 320,
    protein: 25,
    carbs: 28,
    fat: 8,
    fiber: 6,
    sugar: 20,
    date: new Date(Date.now() - 86400000), // Yesterday
    mealType: 'breakfast',
  },
];

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Upper Body Strength',
    date: new Date(),
    duration: 45,
    calories: 320,
    exercises: [
      {
        id: '1',
        name: 'Bench Press',
        sets: [
          { reps: 12, weight: 60, completed: true },
          { reps: 10, weight: 65, completed: true },
          { reps: 8, weight: 70, completed: true },
        ],
        restTime: 90,
      },
      {
        id: '2',
        name: 'Pull-ups',
        sets: [
          { reps: 8, weight: 0, completed: true },
          { reps: 7, weight: 0, completed: true },
          { reps: 6, weight: 0, completed: true },
        ],
        restTime: 60,
      },
    ],
  },
  {
    id: '2',
    name: 'Cardio Session',
    date: new Date(Date.now() - 86400000),
    duration: 30,
    calories: 280,
    exercises: [
      {
        id: '3',
        name: 'Treadmill Running',
        sets: [{ reps: 1, weight: 0, completed: true }],
        notes: '5.5 mph for 30 minutes',
      },
    ],
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI fitness assistant. How can I help you today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3600000),
    type: 'general',
  },
  {
    id: '2',
    content: 'I had a grilled chicken salad for lunch',
    sender: 'user',
    timestamp: new Date(Date.now() - 1800000),
    type: 'food',
  },
  {
    id: '3',
    content: 'Great choice! I\'ve logged your grilled chicken salad (350 calories, 35g protein). That\'s a perfect balanced meal for your fitness goals.',
    sender: 'ai',
    timestamp: new Date(Date.now() - 1700000),
    type: 'food',
  },
];