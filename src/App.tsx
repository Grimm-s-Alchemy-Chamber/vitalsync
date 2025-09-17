import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { useNotifications } from './hooks/useNotifications';

// Components
import { Header } from './components/common/Header';
import { TabNavigation } from './components/common/TabNavigation';
import { ToastContainer } from './components/common/Toast';

// Onboarding Steps
import { HeightStep } from './components/onboarding/steps/HeightStep';
import { WeightStep } from './components/onboarding/steps/WeightStep';
import { AgeStep } from './components/onboarding/steps/AgeStep';
import { GenderStep } from './components/onboarding/steps/GenderStep';
import { GoalStep } from './components/onboarding/steps/GoalStep';
import { ActivityStep } from './components/onboarding/steps/ActivityStep';

// Tab Components
import { ChatInterface } from './components/chat/ChatInterface';
import { MealsList } from './components/meals/MealsList';
import { WorkoutsList } from './components/gym/WorkoutsList';
import { ProfileView } from './components/profile/ProfileView';

// Types and Services
import { User, OnboardingStep, AppTab, ChatMessage, MacroTargets, Meal, Workout, WorkoutPreset, MealPreset } from './types';
import { PreferenceLearnedEvent } from './types/preferences';
import { authService, chatService, mealService, workoutService } from './services/api';
import { MacroCalculator } from './services/macroCalculator';

function App() {
  // Date reviver function to convert createdAt string back to Date object
  const userReviver = (key: string, value: any) => {
    if (key === 'createdAt' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // Meal reviver function to convert date string back to Date object
  const mealReviver = (key: string, value: any) => {
    if (key === 'date' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // Workout reviver function to convert date string back to Date object
  const workoutReviver = (key: string, value: any) => {
    if (key === 'date' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // Preset reviver function to convert date string back to Date object
  const presetReviver = (key: string, value: any) => {
    if (key === 'createdAt' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // Core state
  const [user, setUser] = useLocalStorage<User | null>('user', null, userReviver);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('height');
  const [activeTab, setActiveTab] = useState<AppTab>('chat');
  const [darkMode, toggleDarkMode] = useDarkMode();
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Macro targets
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 67,
    fiber: 28,
    sugar: 50,
  });

  // Meals state for editing
  const [meals, setMeals] = useLocalStorage<Meal[]>('meals', [], mealReviver);
  
  // Workouts state for editing
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', [], workoutReviver);

  // Workout presets state
  const [workoutPresets, setWorkoutPresets] = useLocalStorage<WorkoutPreset[]>('workoutPresets', [], presetReviver);

  // Meal presets state
  const [mealPresets, setMealPresets] = useLocalStorage<MealPreset[]>('mealPresets', [], presetReviver);

  // Onboarding data
  const [onboardingData, setOnboardingData] = useState({
    height: 175,
    weight: 70,
    age: 25,
    gender: 'male' as User['gender'],
    goal: 'maintain' as User['goal'],
    activityLevel: 'moderate' as User['activityLevel'],
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Date filters
  const [selectedMealDate, setSelectedMealDate] = useState(new Date());
  const [selectedWorkoutDate, setSelectedWorkoutDate] = useState(new Date());

  // Calculate macro targets when user changes
  useEffect(() => {
    if (user) {
      const targets = MacroCalculator.calculateMacroTargets(user);
      setMacroTargets(targets);
    }
  }, [user]);

  // Initialize chat messages
  useEffect(() => {
    if (user && chatMessages.length === 0) {
      setChatMessages(chatService.getChatHistory());
    }
  }, [user, chatMessages.length]);

  // Onboarding handlers
  const handleOnboardingNext = () => {
    const steps: OnboardingStep[] = ['height', 'weight', 'age', 'gender', 'goal', 'activity'];
    const currentIndex = steps.indexOf(onboardingStep);
    
    if (currentIndex < steps.length - 1) {
      setOnboardingStep(steps[currentIndex + 1]);
    } else {
      completeOnboarding();
    }
  };

  const handleOnboardingBack = () => {
    const steps: OnboardingStep[] = ['height', 'weight', 'age', 'gender', 'goal', 'activity'];
    const currentIndex = steps.indexOf(onboardingStep);
    
    if (currentIndex > 0) {
      setOnboardingStep(steps[currentIndex - 1]);
    }
  };

  const completeOnboarding = async () => {
    try {
      const newUser = await authService.register({
        name: 'User',
        email: 'user@example.com',
        ...onboardingData,
      });
      setUser(newUser);
      addNotification('Welcome to your fitness journey! 🎉', 'success');
    } catch (error) {
      addNotification('Failed to complete setup. Please try again.', 'error');
    }
  };

  // Enhanced chat handler with preference learning
  const handleSendMessage = async (content: string): Promise<{ learnedPreferences?: PreferenceLearnedEvent[] }> => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoadingChat(true);

    try {
      const response = await chatService.sendMessage(content);
      const { learnedPreferences, ...aiMessage } = response;
      
      setChatMessages(prev => [...prev, aiMessage]);
      
      if (aiMessage.type === 'food') {
        addNotification('Meal logged successfully! 🍽️', 'success');
      } else if (aiMessage.type === 'workout') {
        addNotification('Workout logged successfully! 💪', 'success');
      }

      return { learnedPreferences };
    } catch (error) {
      addNotification('Failed to get AI response. Please try again.', 'error');
      return {};
    } finally {
      setIsLoadingChat(false);
    }
  };

  // User update handler
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    addNotification('Profile updated successfully! ✅', 'success');
  };

  // Meal handlers
  const handleAddMeal = (newMeal: Omit<Meal, 'id'>) => {
    const meal: Meal = {
      ...newMeal,
      id: Date.now().toString(),
    };
    setMeals(prevMeals => [...prevMeals, meal]);
    addNotification('Meal logged successfully! 🍽️', 'success');

    // Create or update meal preset
    const existingPreset = mealPresets.find(preset => 
      preset.name.toLowerCase() === meal.name.toLowerCase() && 
      preset.mealType === meal.mealType
    );

    if (existingPreset) {
      // Update usage count
      setMealPresets(prevPresets => 
        prevPresets.map(preset => 
          preset.id === existingPreset.id 
            ? { ...preset, usageCount: preset.usageCount + 1 }
            : preset
        )
      );
    } else {
      // Create new preset
      const newPreset: MealPreset = {
        id: `preset-${Date.now()}`,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        fiber: meal.fiber,
        sugar: meal.sugar,
        mealType: meal.mealType,
        image: meal.image,
        createdAt: new Date(),
        usageCount: 1,
      };
      setMealPresets(prevPresets => [...prevPresets, newPreset]);
    }
  };

  const handleUpdateMeal = (updatedMeal: Meal) => {
    setMeals(prevMeals => 
      prevMeals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal)
    );
    addNotification('Meal updated successfully! ✅', 'success');
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
    addNotification('Meal deleted successfully! 🗑️', 'success');
  };

  // Meal preset handlers
  const handleAddMealFromPreset = (preset: MealPreset, selectedDate: Date) => {
    const newMeal: Omit<Meal, 'id'> = {
      name: preset.name,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      fiber: preset.fiber,
      sugar: preset.sugar,
      mealType: preset.mealType,
      image: preset.image,
      date: selectedDate,
    };
    
    handleAddMeal(newMeal);
    
    // Update usage count
    setMealPresets(prevPresets => 
      prevPresets.map(p => 
        p.id === preset.id 
          ? { ...p, usageCount: p.usageCount + 1 }
          : p
      )
    );
  };

  const handleDeleteMealPreset = (presetId: string) => {
    setMealPresets(prevPresets => prevPresets.filter(preset => preset.id !== presetId));
    addNotification('Meal preset deleted! 🗑️', 'success');
  };

  // Workout handlers
  const handleAddWorkout = (newWorkout: Omit<Workout, 'id'>) => {
    const workout: Workout = {
      ...newWorkout,
      id: Date.now().toString(),
    };
    setWorkouts(prevWorkouts => [...prevWorkouts, workout]);
    addNotification('Workout logged successfully! 💪', 'success');
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => workout.id === updatedWorkout.id ? updatedWorkout : workout)
    );
    addNotification('Workout updated successfully! ✅', 'success');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== workoutId));
    addNotification('Workout deleted successfully! 🗑️', 'success');
  };

  // Workout preset handlers
  const handleAddPreset = (newPreset: Omit<WorkoutPreset, 'id' | 'createdAt'>) => {
    const preset: WorkoutPreset = {
      ...newPreset,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setWorkoutPresets(prevPresets => [...prevPresets, preset]);
    addNotification('Workout preset created! 📋', 'success');
  };

  const handleUpdatePreset = (updatedPreset: WorkoutPreset) => {
    setWorkoutPresets(prevPresets => 
      prevPresets.map(preset => preset.id === updatedPreset.id ? updatedPreset : preset)
    );
    addNotification('Preset updated successfully! ✅', 'success');
  };

  const handleDeletePreset = (presetId: string) => {
    setWorkoutPresets(prevPresets => prevPresets.filter(preset => preset.id !== presetId));
    addNotification('Preset deleted successfully! 🗑️', 'success');
  };

  // Get filtered meals for selected date
  const getFilteredMeals = () => {
    const storedMeals = mealService.getMeals(selectedMealDate);
    const userMeals = meals.filter(meal => 
      meal.date.toDateString() === selectedMealDate.toDateString()
    );
    return [...storedMeals, ...userMeals];
  };

  // Get filtered workouts for selected date
  const getFilteredWorkouts = () => {
    const storedWorkouts = workoutService.getWorkouts(selectedWorkoutDate);
    const userWorkouts = workouts.filter(workout => 
      workout.date.toDateString() === selectedWorkoutDate.toDateString()
    );
    return [...storedWorkouts, ...userWorkouts];
  };

  // If no user, show onboarding
  if (!user) {
    const updateOnboardingData = (key: keyof typeof onboardingData, value: any) => {
      setOnboardingData(prev => ({ ...prev, [key]: value }));
    };

    switch (onboardingStep) {
      case 'height':
        return (
          <HeightStep
            value={onboardingData.height}
            onChange={(height) => updateOnboardingData('height', height)}
            onNext={handleOnboardingNext}
          />
        );
      case 'weight':
        return (
          <WeightStep
            value={onboardingData.weight}
            onChange={(weight) => updateOnboardingData('weight', weight)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'age':
        return (
          <AgeStep
            value={onboardingData.age}
            onChange={(age) => updateOnboardingData('age', age)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'gender':
        return (
          <GenderStep
            value={onboardingData.gender}
            onChange={(gender) => updateOnboardingData('gender', gender)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'goal':
        return (
          <GoalStep
            value={onboardingData.goal}
            onChange={(goal) => updateOnboardingData('goal', goal)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'activity':
        return (
          <ActivityStep
            value={onboardingData.activityLevel}
            onChange={(activityLevel) => updateOnboardingData('activityLevel', activityLevel)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      default:
        return null;
    }
  }

  // Main app content
  const getTabTitle = () => {
    switch (activeTab) {
      case 'chat': return 'AI Assistant';
      case 'meals': return 'Meal Tracker';
      case 'gym': return 'Workout Log';
      case 'profile': return 'Profile';
      default: return 'FitTracker';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingChat}
          />
        );
      case 'meals':
        return (
          <MealsList
            meals={getFilteredMeals()}
            selectedDate={selectedMealDate}
            onDateChange={setSelectedMealDate}
            macroTargets={macroTargets}
            onAddMeal={handleAddMeal}
            onUpdateMeal={handleUpdateMeal}
            onDeleteMeal={handleDeleteMeal}
            mealPresets={mealPresets}
            onAddMealFromPreset={handleAddMealFromPreset}
            onDeleteMealPreset={handleDeleteMealPreset}
          />
        );
      case 'gym':
        return (
          <WorkoutsList
            workouts={getFilteredWorkouts()}
            selectedDate={selectedWorkoutDate}
            onDateChange={setSelectedWorkoutDate}
            onAddWorkout={handleAddWorkout}
            onUpdateWorkout={handleUpdateWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            presets={workoutPresets}
            onAddPreset={handleAddPreset}
            onUpdatePreset={handleUpdatePreset}
            onDeletePreset={handleDeletePreset}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            macroTargets={macroTargets}
            onEditProfile={() => {}} // This is now handled internally by ProfileView
            onUpdateUser={handleUpdateUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header
        title={getTabTitle()}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <main className="pb-20">
        {renderTabContent()}
      </main>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ToastContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
}

export default App;