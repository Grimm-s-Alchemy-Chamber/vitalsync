import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Plus, Trash2, Clock, Flame, Dumbbell, ChevronDown, Check } from 'lucide-react';
import { WorkoutPreset, PresetExercise, PresetSet } from '../../types';

interface WorkoutPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: Omit<WorkoutPreset, 'id' | 'createdAt'>) => void;
  editingPreset?: WorkoutPreset | null;
}

const workoutCategories = [
  { value: 'Strength', label: 'Strength', emoji: '💪', description: 'Weight training & resistance' },
  { value: 'Cardio', label: 'Cardio', emoji: '🏃', description: 'Running, cycling, HIIT' },
  { value: 'Bodyweight', label: 'Bodyweight', emoji: '🤸', description: 'Push-ups, squats, planks' },
  { value: 'Calisthenics', label: 'Calisthenics', emoji: '🤾', description: 'Pull-ups, dips, muscle-ups' },
  { value: 'Yoga', label: 'Yoga', emoji: '🧘', description: 'Stretching & mindfulness' },
];

export function WorkoutPresetModal({ isOpen, onClose, onSave, editingPreset }: WorkoutPresetModalProps) {
  const [presetData, setPresetData] = useState({
    name: editingPreset?.name || '',
    category: editingPreset?.category || 'Strength',
    estimatedDuration: editingPreset?.estimatedDuration || 45,
    estimatedCalories: editingPreset?.estimatedCalories || 300,
    exercises: editingPreset?.exercises || [] as Omit<PresetExercise, 'id'>[],
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    if (!presetData.name.trim()) {
      alert('Preset name is required');
      return;
    }

    if (presetData.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const newPreset: Omit<WorkoutPreset, 'id' | 'createdAt'> = {
      ...presetData,
      exercises: presetData.exercises.map((exercise, index) => ({
        ...exercise,
        id: `exercise-${index}`,
      })),
    };

    onSave(newPreset);
    
    // Reset form
    setPresetData({
      name: '',
      category: 'Strength',
      estimatedDuration: 45,
      estimatedCalories: 300,
      exercises: [],
    });
    
    onClose();
  };

  const addExercise = () => {
    const newExercise: Omit<PresetExercise, 'id'> = {
      name: '',
      sets: [{ reps: 10, weight: 0 }],
      restTime: 60,
      notes: '',
    };
    
    setPresetData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const updateExercise = (index: number, field: keyof Omit<PresetExercise, 'id'>, value: any) => {
    setPresetData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const removeExercise = (index: number) => {
    setPresetData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const addSet = (exerciseIndex: number) => {
    const newSet: PresetSet = { reps: 10, weight: 0 };
    setPresetData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      ),
    }));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof PresetSet, value: any) => {
    setPresetData(prev => ({
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
    setPresetData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? { ...exercise, sets: exercise.sets.filter((_, j) => j !== setIndex) }
          : exercise
      ),
    }));
  };

  const handleCategorySelect = (category: string) => {
    setPresetData(prev => ({ ...prev, category }));
    setIsDropdownOpen(false);
  };

  const selectedCategory = workoutCategories.find(cat => cat.value === presetData.category);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingPreset ? 'Edit Preset' : 'Create Workout Preset'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Preset Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preset Name *
            </label>
            <input
              type="text"
              value={presetData.name}
              onChange={(e) => setPresetData(prev => ({ ...prev, name: e.target.value }))}
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
                      presetData.category === category.value ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
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
                    {presetData.category === category.value && (
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
                Duration (min)
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  type="number"
                  min="1"
                  value={presetData.estimatedDuration}
                  onChange={(e) => setPresetData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))}
                  className="w-full pl-10 pr-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Est. Calories
              </label>
              <div className="relative">
                <Flame size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                <input
                  type="number"
                  min="0"
                  value={presetData.estimatedCalories}
                  onChange={(e) => setPresetData(prev => ({ ...prev, estimatedCalories: parseInt(e.target.value) || 0 }))}
                  className="w-full pl-10 pr-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-orange-900 dark:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Exercises - Enhanced Form */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                <Dumbbell size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                Exercises
              </h4>
              <button
                onClick={addExercise}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
              >
                <Plus size={14} />
                <span>Add Exercise</span>
              </button>
            </div>

            {presetData.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4 border border-gray-200 dark:border-gray-600">
                {/* Exercise Name and Remove Button */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => updateExercise(exerciseIndex, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Exercise name (e.g., Bench Press)"
                  />
                  <button
                    onClick={() => removeExercise(exerciseIndex)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove exercise"
                  >
                    <Trash2 size={16} />
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
                        value={set.weight || 0}
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

                {/* Rest Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Rest Time (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={exercise.restTime || 60}
                    onChange={(e) => updateExercise(exerciseIndex, 'restTime', parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Exercise Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={exercise.notes || ''}
                    onChange={(e) => updateExercise(exerciseIndex, 'notes', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                    placeholder="Form cues, weight progression, tempo, etc."
                  />
                </div>

                {/* Exercise Summary */}
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">{exercise.name || 'Exercise'}</span>
                    {exercise.sets.length > 0 && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        • {exercise.sets.length} sets
                      </span>
                    )}
                    {exercise.restTime && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        • {exercise.restTime}s rest
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {presetData.exercises.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <Dumbbell className="mx-auto mb-3 text-gray-400" size={32} />
                <p className="font-medium">No exercises added yet</p>
                <p className="text-xs mt-1">Click "Add Exercise" to build your workout preset</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Save size={16} />
            <span>{editingPreset ? 'Update' : 'Save'} Preset</span>
          </button>
        </div>
      </div>
    </div>
  );
}