import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Clock, Flame, Dumbbell, Play, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { WorkoutPreset } from '../../types';
import { WorkoutPresetModal } from './WorkoutPresetModal';

interface WorkoutPresetsViewProps {
  presets: WorkoutPreset[];
  onAddPreset: (preset: Omit<WorkoutPreset, 'id' | 'createdAt'>) => void;
  onUpdatePreset: (preset: WorkoutPreset) => void;
  onDeletePreset: (presetId: string) => void;
  onUsePreset: (preset: WorkoutPreset) => void;
  onBack: () => void;
}

export function WorkoutPresetsView({ 
  presets, 
  onAddPreset, 
  onUpdatePreset, 
  onDeletePreset, 
  onUsePreset,
  onBack 
}: WorkoutPresetsViewProps) {
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [editingPreset, setEditingPreset] = useState<WorkoutPreset | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [collapsedPresets, setCollapsedPresets] = useState<Set<string>>(new Set());

  const handleSavePreset = (presetData: Omit<WorkoutPreset, 'id' | 'createdAt'>) => {
    if (editingPreset) {
      onUpdatePreset({
        ...editingPreset,
        ...presetData,
      });
      setEditingPreset(null);
    } else {
      onAddPreset(presetData);
    }
    setShowPresetModal(false);
  };

  const handleEditPreset = (preset: WorkoutPreset) => {
    setEditingPreset(preset);
    setShowPresetModal(true);
  };

  const handleDeletePreset = (presetId: string) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      onDeletePreset(presetId);
    }
  };

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const togglePreset = (presetId: string) => {
    const newCollapsed = new Set(collapsedPresets);
    if (newCollapsed.has(presetId)) {
      newCollapsed.delete(presetId);
    } else {
      newCollapsed.add(presetId);
    }
    setCollapsedPresets(newCollapsed);
  };

  const groupedPresets = presets.reduce((acc, preset) => {
    const category = preset.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(preset);
    return acc;
  }, {} as Record<string, WorkoutPreset[]>);

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          <ArrowLeft size={20} />
          <span>Back to Workouts</span>
        </button>
        
        <button
          onClick={() => setShowPresetModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>New Preset</span>
        </button>
      </div>

      {/* Presets List */}
      {Object.keys(groupedPresets).length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <Dumbbell className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Workout Presets Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Create workout presets to quickly log your favorite routines
            </p>
            <button
              onClick={() => setShowPresetModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Create Your First Preset</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedPresets).map(([category, categoryPresets]) => {
            const isCategoryCollapsed = collapsedCategories.has(category);
            
            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Collapsible Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Dumbbell size={20} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {categoryPresets.length} preset{categoryPresets.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isCategoryCollapsed ? (
                      <ChevronRight size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Collapsible Content */}
                {!isCategoryCollapsed && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <div className="p-4 space-y-3">
                      {categoryPresets.map((preset) => {
                        const isPresetCollapsed = collapsedPresets.has(preset.id);
                        
                        return (
                          <div key={preset.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                            {/* Collapsible Preset Header */}
                            <button
                              onClick={() => togglePreset(preset.id)}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              <div className="flex-1 text-left">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {preset.name}
                                </h4>
                                <div className="flex items-center space-x-3 text-sm">
                                  <span className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                                    <Clock size={12} className="mr-1 text-blue-600 dark:text-blue-400" />
                                    <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">{preset.estimatedDuration}m</span>
                                  </span>
                                  <span className="flex items-center bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                                    <Flame size={12} className="mr-1 text-orange-600 dark:text-orange-400" />
                                    <span className="text-orange-700 dark:text-orange-300 font-medium text-xs">{preset.estimatedCalories} cal</span>
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {preset.exercises.length} exercise{preset.exercises.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {isPresetCollapsed ? (
                                  <ChevronRight size={16} className="text-gray-400" />
                                ) : (
                                  <ChevronDown size={16} className="text-gray-400" />
                                )}
                              </div>
                            </button>

                            {/* Collapsed State - Big Action Buttons */}
                            {isPresetCollapsed && (
                              <div className="px-4 pb-4">
                                <div className="grid grid-cols-3 gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUsePreset(preset);
                                    }}
                                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  >
                                    <Play size={18} className="text-green-600 dark:text-green-400" />
                                    <span className="text-green-700 dark:text-green-300 font-medium text-sm">Use</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditPreset(preset);
                                    }}
                                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                  >
                                    <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
                                    <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">Edit</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePreset(preset.id);
                                    }}
                                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                                    <span className="text-red-700 dark:text-red-300 font-medium text-sm">Delete</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Expanded State - Detailed Exercise List */}
                            {!isPresetCollapsed && (
                              <div className="border-t border-gray-200 dark:border-gray-600">
                                <div className="p-4">
                                  {/* Small Action Buttons in Expanded State */}
                                  <div className="flex items-center justify-end space-x-1 mb-4">
                                    <button
                                      onClick={() => onUsePreset(preset)}
                                      className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                                      title="Use this preset"
                                    >
                                      <Play size={14} className="text-green-600 dark:text-green-400" />
                                    </button>
                                    
                                    <button
                                      onClick={() => handleEditPreset(preset)}
                                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                      title="Edit preset"
                                    >
                                      <Edit3 size={14} className="text-gray-600 dark:text-gray-400" />
                                    </button>
                                    
                                    <button
                                      onClick={() => handleDeletePreset(preset.id)}
                                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                                      title="Delete preset"
                                    >
                                      <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                                    </button>
                                  </div>

                                  {/* Detailed Exercise List */}
                                  <div className="space-y-3">
                                    {preset.exercises.map((exercise, index) => (
                                      <div key={exercise.id} className="bg-white dark:bg-gray-600 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                                            {exercise.name}
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {exercise.sets.length} sets • {exercise.restTime || 60}s rest
                                          </span>
                                        </div>
                                        
                                        {/* Compact Sets Display */}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {exercise.sets.map((set, setIndex) => (
                                            <span 
                                              key={setIndex}
                                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded font-medium"
                                            >
                                              {set.weight && set.weight > 0 ? `${set.weight}kg` : ''} × {set.reps}
                                            </span>
                                          ))}
                                        </div>

                                        {exercise.notes && (
                                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                            {exercise.notes}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Preset Modal */}
      <WorkoutPresetModal
        isOpen={showPresetModal}
        onClose={() => {
          setShowPresetModal(false);
          setEditingPreset(null);
        }}
        onSave={handleSavePreset}
        editingPreset={editingPreset}
      />
    </div>
  );
}