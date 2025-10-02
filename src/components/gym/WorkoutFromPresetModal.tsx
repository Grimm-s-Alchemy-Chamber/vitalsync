import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Workout, Exercise, Set, WorkoutPreset } from '../../types';

interface WorkoutFromPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: Omit<Workout, 'id'>) => void;
  selectedDate: Date;
  preset: WorkoutPreset;
}

export function WorkoutFromPresetModal({ isOpen, onClose, onSave, selectedDate, preset }: WorkoutFromPresetModalProps) {
  const [workoutData, setWorkoutData] = useState({
    name: preset.name,
    duration: preset.estimatedDuration,
    calories: preset.estimatedCalories,
    notes: '',
    exercises: preset.exercises.map(presetExercise => ({
      name: presetExercise.name,
      sets: presetExercise.sets.map(presetSet => ({
        reps: presetSet.reps,
        weight: presetSet.weight || 0,
        completed: false,
      })) as Set[],
      restTime: presetExercise.restTime || 60,
      notes: presetExercise.notes || '',
    })) as Omit<Exercise, 'id'>[],
  });

  const handleSave = () => {
    const newWorkout: Omit<Workout, 'id'> = {
      ...workoutData,
      date: selectedDate,
      exercises: workoutData.exercises.map((exercise, index) => ({
        ...exercise,
        id: `exercise-${index}`,
      })),
    };

    onSave(newWorkout);
    onClose();
  };

  const updateExercise = (index: number, field: keyof Omit<Exercise, 'id'>, value: any) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      ),
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Log Workout: {preset.name}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Workout Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (min)
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
            <h4 className="font-medium text-gray-900 dark:text-white">Exercises</h4>

            {workoutData.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {exercise.name}
                  </h5>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                    {exercise.sets.length} sets
                  </span>
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
                        <Trash2 size={12} />
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
              Workout Notes (Optional)
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