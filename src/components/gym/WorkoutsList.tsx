import React, { useState, useRef } from 'react';
import { Clock, Dumbbell, Flame, Plus, BookOpen, Edit3, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, Camera, Upload, X } from 'lucide-react';
import { Workout, WorkoutPreset } from '../../types';
import { DateSelector } from '../common/DateSelector';
import { WorkoutEntryModal } from './WorkoutEntryModal';
import { WorkoutEditModal } from './WorkoutEditModal';
import { WorkoutPresetsView } from './WorkoutPresetsView';
import { WorkoutFromPresetModal } from './WorkoutFromPresetModal';

interface WorkoutsListProps {
  workouts: Workout[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddWorkout?: (workout: Omit<Workout, 'id'>) => void;
  onUpdateWorkout?: (updatedWorkout: Workout) => void;
  onDeleteWorkout?: (workoutId: string) => void;
  presets: WorkoutPreset[];
  onAddPreset: (preset: Omit<WorkoutPreset, 'id' | 'createdAt'>) => void;
  onUpdatePreset: (preset: WorkoutPreset) => void;
  onDeletePreset: (presetId: string) => void;
}

export function WorkoutsList({ 
  workouts, 
  selectedDate, 
  onDateChange, 
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
  presets,
  onAddPreset,
  onUpdatePreset,
  onDeletePreset
}: WorkoutsListProps) {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showPresetsView, setShowPresetsView] = useState(false);
  const [showPresetWorkoutModal, setShowPresetWorkoutModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<WorkoutPreset | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());
  const [uploadingWorkoutId, setUploadingWorkoutId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);

  const handleAddWorkout = (workout: Omit<Workout, 'id'>) => {
    if (onAddWorkout) {
      onAddWorkout(workout);
    }
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    if (onUpdateWorkout) {
      onUpdateWorkout(updatedWorkout);
    }
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if (onDeleteWorkout) {
      onDeleteWorkout(workoutId);
    }
    setEditingWorkout(null);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
  };

  const handleUsePreset = (preset: WorkoutPreset) => {
    setSelectedPreset(preset);
    setShowPresetWorkoutModal(true);
  };

  const toggleWorkoutExpansion = (workoutId: string) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedWorkouts(newExpanded);
  };

  const handleCameraClick = (workoutId: string) => {
    setUploadingWorkoutId(workoutId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0 || !uploadingWorkoutId) return;

    const workoutToUpdate = workouts.find(workout => workout.id === uploadingWorkoutId);
    if (!workoutToUpdate) return;

    const currentImages = workoutToUpdate.images || [];

    // Check if adding these files would exceed the 4 image limit
    if (currentImages.length + files.length > 4) {
      alert('You can only have up to 4 photos per workout');
      return;
    }

    let processedCount = 0;
    const totalFiles = files.length;

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
        if (onUpdateWorkout) {
          const updatedWorkout = {
            ...workoutToUpdate,
            images: [...(workoutToUpdate.images || []), imageUrl],
          };
          onUpdateWorkout(updatedWorkout);
          
          processedCount++;
          if (processedCount === totalFiles) {
            setUploadingWorkoutId(null);
            // Clear the file input
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (workout: Workout, imageIndex: number) => {
    if (onUpdateWorkout) {
      const updatedWorkout = {
        ...workout,
        images: (workout.images || []).filter((_, i) => i !== imageIndex),
      };
      onUpdateWorkout(updatedWorkout);
    }
  };

  if (showPresetsView) {
    return (
      <WorkoutPresetsView
        presets={presets}
        onAddPreset={onAddPreset}
        onUpdatePreset={onUpdatePreset}
        onDeletePreset={onDeletePreset}
        onUsePreset={handleUsePreset}
        onBack={() => setShowPresetsView(false)}
      />
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
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

      {/* Compact Date Selector and Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Workouts
          </h2>
          
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            label="Date"
          />
        </div>

        {/* Daily Summary - Compact */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{workouts.length}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Workouts</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
            <div className="text-lg font-bold text-green-700 dark:text-green-300">{totalDuration}m</div>
            <div className="text-xs text-green-600 dark:text-green-400">Duration</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
            <div className="text-lg font-bold text-orange-700 dark:text-orange-300">{totalCalories}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Calories</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowPresetsView(true)}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <BookOpen size={20} />
          <span className="font-medium">Workout Presets</span>
        </button>
        
        <button
          onClick={() => setShowEntryModal(true)}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span className="font-medium">Manual Entry</span>
        </button>
      </div>

      {/* Workouts List */}
      <div className="space-y-3">
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6">
              <Dumbbell className="mx-auto mb-3 text-gray-400" size={40} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No workouts logged yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Use the chat to log your workouts with AI assistance, create presets, or add them manually!
              </p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setShowPresetsView(true)}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <BookOpen size={16} />
                  <span>Browse Presets</span>
                </button>
                <button
                  onClick={() => setShowEntryModal(true)}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>Manual Entry</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          workouts.map((workout) => {
            const isExpanded = expandedWorkouts.has(workout.id);
            const hasImages = workout.images && workout.images.length > 0;
            
            return (
              <div key={workout.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {/* Workout Images */}
                {hasImages && (
                  <div className="relative">
                    {workout.images!.length === 1 ? (
                      <div className="relative">
                        <img
                          src={workout.images![0]}
                          alt="Workout"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={() => removeImage(workout, 0)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/80 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        {workout.images!.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Workout photo ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            <button
                              onClick={() => removeImage(workout, index)}
                              className="absolute top-1 right-1 p-1 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/80 transition-colors"
                            >
                              <X size={10} />
                            </button>
                            {index === 3 && workout.images!.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-medium">+{workout.images!.length - 4}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Photo count indicator */}
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <ImageIcon size={12} />
                      <span>{workout.images!.length}</span>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleWorkoutExpansion(workout.id)}
                    className="w-full flex items-start justify-between mb-3 text-left"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                        {workout.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                          <Clock size={14} className="mr-1 text-blue-600 dark:text-blue-400" />
                          <span className="text-blue-700 dark:text-blue-300 font-medium">{workout.duration}m</span>
                        </span>
                        <span className="flex items-center bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                          <Flame size={14} className="mr-1 text-orange-600 dark:text-orange-400" />
                          <span className="text-orange-700 dark:text-orange-300 font-medium">{workout.calories} cal</span>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronLeft size={20} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Collapsed State - Action Buttons */}
                  {!isExpanded && (
                    <div className="flex items-center justify-end space-x-2">
                      {/* Camera Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCameraClick(workout.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          hasImages 
                            ? 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30' 
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={hasImages ? "Add more photos" : "Add photos"}
                      >
                        <Camera size={16} className={
                          hasImages 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        } />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWorkout(workout);
                        }}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Edit workout"
                      >
                        <Edit3 size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      
                      {onDeleteWorkout && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this workout?')) {
                              onDeleteWorkout(workout.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete workout"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expanded State - Detailed View */}
                  {isExpanded && (
                    <div className="space-y-4">
                      {/* Action Buttons in Expanded State */}
                      <div className="flex items-center justify-end space-x-2">
                        {/* Camera Button */}
                        <button
                          onClick={() => handleCameraClick(workout.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            hasImages 
                              ? 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30' 
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title={hasImages ? "Add more photos" : "Add photos"}
                        >
                          <Camera size={16} className={
                            hasImages 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          } />
                        </button>

                        <button
                          onClick={() => handleEditWorkout(workout)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Edit workout"
                        >
                          <Edit3 size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        
                        {onDeleteWorkout && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this workout?')) {
                                onDeleteWorkout(workout.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete workout"
                          >
                            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        )}
                      </div>

                      {/* Exercises */}
                      <div className="space-y-3">
                        {workout.exercises.map((exercise) => (
                          <div key={exercise.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {exercise.name}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                                {exercise.sets.length} sets
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              {exercise.sets.map((set, setIndex) => (
                                <div 
                                  key={setIndex}
                                  className={`text-center py-2 px-2 rounded-lg font-medium ${
                                    set.completed 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                      : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                  }`}
                                >
                                  {set.weight > 0 ? `${set.weight}kg` : ''} × {set.reps}
                                </div>
                              ))}
                            </div>

                            {exercise.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic bg-gray-100 dark:bg-gray-600 p-2 rounded-lg">
                                {exercise.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {workout.notes && (
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                          <p className="text-sm text-purple-700 dark:text-purple-300 italic">
                            {workout.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Entry Modal */}
      <WorkoutEntryModal
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        onSave={handleAddWorkout}
        selectedDate={selectedDate}
      />

      {/* Edit Modal */}
      {editingWorkout && (
        <WorkoutEditModal
          workout={editingWorkout}
          isOpen={true}
          onClose={() => setEditingWorkout(null)}
          onSave={handleUpdateWorkout}
          onDelete={onDeleteWorkout ? handleDeleteWorkout : undefined}
        />
      )}

      {/* Preset Workout Modal */}
      {selectedPreset && (
        <WorkoutFromPresetModal
          isOpen={showPresetWorkoutModal}
          onClose={() => {
            setShowPresetWorkoutModal(false);
            setSelectedPreset(null);
          }}
          onSave={handleAddWorkout}
          selectedDate={selectedDate}
          preset={selectedPreset}
        />
      )}
    </div>
  );
}