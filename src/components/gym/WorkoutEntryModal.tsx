import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Plus, Trash2, ChevronDown, Check, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Workout, Exercise, Set } from '../../types';

interface WorkoutEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: Omit<Workout, 'id'>) => void;
  selectedDate: Date;
}

const workoutCategories = [
  { value: 'Strength', label: 'Strength', emoji: '💪', description: 'Weight training & resistance' },
  { value: 'Cardio', label: 'Cardio', emoji: '🏃', description: 'Running, cycling, HIIT' },
  { value: 'Bodyweight', label: 'Bodyweight', emoji: '🤸', description: 'Push-ups, squats, planks' },
  { value: 'Calisthenics', label: 'Calisthenics', emoji: '🤾', description: 'Pull-ups, dips, muscle-ups' },
  { value: 'Yoga', label: 'Yoga', emoji: '🧘', description: 'Stretching & mindfulness' },
];

export function WorkoutEntryModal({ isOpen, onClose, onSave, selectedDate }: WorkoutEntryModalProps) {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    duration: 0,
    calories: 0,
    notes: '',
    category: 'Strength',
    exercises: [] as Omit<Exercise, 'id'>[],
    images: [] as string[],
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Close dropdown when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    // Validate required fields
    if (!workoutData.name.trim()) {
      alert('Workout name is required');
      return;
    }

    if (workoutData.duration <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    if (workoutData.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const newWorkout: Omit<Workout, 'id'> = {
      ...workoutData,
      date: selectedDate,
      exercises: workoutData.exercises.map((exercise, index) => ({
        ...exercise,
        id: `exercise-${index}`,
      })),
    };

    onSave(newWorkout);
    
    // Reset form
    setWorkoutData({
      name: '',
      duration: 0,
      calories: 0,
      notes: '',
      category: 'Strength',
      exercises: [],
      images: [],
    });
    
    onClose();
  };

  const addExercise = () => {
    const newExercise: Omit<Exercise, 'id'> = {
      name: '',
      sets: [{ reps: 0, weight: 0, completed: false }],
      restTime: 60,
    };
    
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const updateExercise = (index: number, field: keyof Omit<Exercise, 'id'>, value: any) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const removeExercise = (index: number) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const addSet = (exerciseIndex: number) => {
    const newSet: Set = { reps: 0, weight: 0, completed: false };
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      ),
    }));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) => 
                j === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      ),
    }));
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? { ...exercise, sets: exercise.sets.filter((_, j) => j !== setIndex) }
          : exercise
      ),
    }));
  };

  const handleCategorySelect = (category: string) => {
    setWorkoutData(prev => ({ ...prev, category }));
    setIsDropdownOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check if adding these files would exceed the 4 image limit
    if (workoutData.images.length + files.length > 4) {
      alert('You can only add up to 4 photos per workout');
      return;
    }

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      // Validate file size (max 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        alert('Each image should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setWorkoutData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setWorkoutData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const selectedCategory = workoutCategories.find(cat => cat.value === workoutData.category);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Log New Workout
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Workout Photos Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Workout Photos (Optional)
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {workoutData.images.length}/4 photos
              </span>
            </div>
            
            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Existing Photos */}
              {workoutData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Workout photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* Add Photo Button */}
              {workoutData.images.length < 4 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors bg-gray-50 dark:bg-gray-700/50 group"
                >
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    <Camera size={16} />
                    <Upload size={14} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 mt-1">
                    Add Photo
                  </span>
                </button>
              )}
            </div>

            {/* Photo Upload Info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
              <div className="flex items-center space-x-1 mb-1">
                <ImageIcon size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Photo Tips:</span>
              </div>
              <ul className="text-xs space-y-0.5 ml-4">
                <li>• Capture your form, equipment setup, or progress</li>
                <li>• Up to 4 photos per workout • Max 5MB each</li>
                <li>• JPG, PNG formats supported</li>
              </ul>
            </div>
          </div>

          {/* Workout Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workout Name *
            </label>
            <input
              type="text"
              value={workoutData.name}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Upper Body Strength"
            />
          </div>

          {/* Enhanced Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{selectedCategory?.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCategory?.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedCategory?.description}
                    </div>
                  </div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Enhanced Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                {workoutCategories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategorySelect(category.value)}
                    className={`w-full px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center space-x-3 ${
                      workoutData.category === category.value ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <span className="text-xl">{category.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {category.description}
                      </div>
                    </div>
                    {workoutData.category === category.value && (
                      <Check size={16} className="text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration and Calories */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (min) *
              </label>
              <input
                type="number"
                min="1"
                value={workoutData.duration}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Calories Burned
              </label>
              <input
                type="number"
                min="0"
                value={workoutData.calories}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-orange-900 dark:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Exercises</h4>
              <button
                onClick={addExercise}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
              >
                <Plus size={14} />
                <span>Add Exercise</span>
              </button>
            </div>

            {workoutData.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => updateExercise(exerciseIndex, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Exercise name"
                  />
                  <button
                    onClick={() => removeExercise(exerciseIndex)}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Sets</span>
                    <button
                      onClick={() => addSet(exerciseIndex)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      + Add Set
                    </button>
                  </div>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center space-x-2 text-sm">
                      <span className="w-8 text-center text-gray-500 dark:text-gray-400">
                        {setIndex + 1}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={set.weight}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-center"
                        placeholder="kg"
                      />
                      <span className="text-gray-500 dark:text-gray-400">×</span>
                      <input
                        type="number"
                        min="0"
                        value={set.reps}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-center"
                        placeholder="reps"
                      />
                      <button
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={workoutData.notes}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="How did the workout feel? Any notes for next time..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            <span>Log Workout</span>
          </button>
        </div>
      </div>
    </div>
  );
}