import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { Workout, Exercise, Set } from '../../types';

interface WorkoutEditModalProps {
  workout: Workout;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedWorkout: Workout) => void;
  onDelete?: (workoutId: string) => void;
}

const workoutCategories = [
  { value: 'Strength', label: 'Strength', emoji: '💪', description: 'Weight training & resistance' },
  { value: 'Cardio', label: 'Cardio', emoji: '🏃', description: 'Running, cycling, HIIT' },
  { value: 'Bodyweight', label: 'Bodyweight', emoji: '🤸', description: 'Push-ups, squats, planks' },
  { value: 'Calisthenics', label: 'Calisthenics', emoji: '🤾', description: 'Pull-ups, dips, muscle-ups' },
  { value: 'Yoga', label: 'Yoga', emoji: '🧘', description: 'Stretching & mindfulness' },
];

export function WorkoutEditModal({ workout, isOpen, onClose, onSave, onDelete }: WorkoutEditModalProps) {
  const [editedWorkout, setEditedWorkout] = useState<Workout>(workout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update edited workout when workout prop changes
  useEffect(() => {
    setEditedWorkout(workout);
  }, [workout]);

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
    if (!editedWorkout.name.trim()) {
      alert('Workout name is required');
      return;
    }

    if (editedWorkout.duration <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    if (editedWorkout.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    onSave(editedWorkout);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this workout?')) {
      onDelete(workout.id);
      onClose();
    }
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: '',
      sets: [{ reps: 0, weight: 0, completed: false }],
      restTime: 60,
    };
    
    setEditedWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    setEditedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const removeExercise = (index: number) => {
    setEditedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const addSet = (exerciseIndex: number) => {
    const newSet: Set = { reps: 0, weight: 0, completed: false };
    setEditedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      ),
    }));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
    setEditedWorkout(prev => ({
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
    setEditedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? { ...exercise, sets: exercise.sets.filter((_, j) => j !== setIndex) }
          : exercise
      ),
    }));
  };

  const handleCategorySelect = (category: string) => {
    setEditedWorkout(prev => ({ ...prev, category }));
    setIsDropdownOpen(false);
  };

  const selectedCategory = workoutCategories.find(cat => cat.value === (editedWorkout as any).category) || workoutCategories[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Workout
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Workout Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workout Name *
            </label>
            <input
              type="text"
              value={editedWorkout.name}
              onChange={(e) => setEditedWorkout(prev => ({ ...prev, name: e.target.value }))}
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
                      (editedWorkout as any).category === category.value ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
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
                    {(editedWorkout as any).category === category.value && (
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
                value={editedWorkout.duration}
                onChange={(e) => setEditedWorkout(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
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
                value={editedWorkout.calories}
                onChange={(e) => setEditedWorkout(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
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

            {editedWorkout.exercises.map((exercise, exerciseIndex) => (
              <div key={exercise.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-3">
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
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={set.completed}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'completed', e.target.checked)}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Done</span>
                      </label>
                      <button
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Exercise Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Exercise Notes
                  </label>
                  <textarea
                    value={exercise.notes || ''}
                    onChange={(e) => updateExercise(exerciseIndex, 'notes', e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={2}
                    placeholder="Form notes, weight progression, etc."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Workout Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workout Notes (Optional)
            </label>
            <textarea
              value={editedWorkout.notes || ''}
              onChange={(e) => setEditedWorkout(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="How did the workout feel? Any notes for next time..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          )}
          
          <div className="flex-1" />
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}