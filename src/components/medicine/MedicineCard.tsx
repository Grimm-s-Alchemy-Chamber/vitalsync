import React, { useState } from 'react';
import { Edit3, Trash2, Clock, Utensils, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { Medicine } from '../../types/medicine';

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicineId: string) => void;
}

export function MedicineCard({ medicine, onEdit, onDelete }: MedicineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTimingDisplay = () => {
    switch (medicine.timing) {
      case 'before_meal':
        return {
          text: `${medicine.timingOffset || 0}min before ${medicine.mealType?.replace('_', ' ') || 'meal'}`,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case 'after_meal':
        return {
          text: `${medicine.timingOffset || 0}min after ${medicine.mealType?.replace('_', ' ') || 'meal'}`,
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20'
        };
      case 'with_meal':
        return {
          text: `With ${medicine.mealType?.replace('_', ' ') || 'meal'}`,
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-900/20'
        };
      case 'empty_stomach':
        return {
          text: 'On empty stomach',
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-900/20'
        };
      default:
        return {
          text: 'Anytime',
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-700'
        };
    }
  };

  const timingDisplay = getTimingDisplay();
  const adherenceRate = medicine.totalDoses > 0 
    ? ((medicine.totalDoses - medicine.missedDoses) / medicine.totalDoses) * 100 
    : 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {medicine.name}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {medicine.dosage} {medicine.unit}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {medicine.frequency.replace('_', ' ')}
              </span>
              
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${timingDisplay.bg}`}>
                <Utensils size={12} className={timingDisplay.color} />
                <span className={`text-xs font-medium ${timingDisplay.color}`}>
                  {timingDisplay.text}
                </span>
              </div>
            </div>

            {/* Reminder Times */}
            <div className="flex items-center space-x-2 mt-2">
              <Clock size={14} className="text-gray-400" />
              <div className="flex space-x-1">
                {medicine.reminderTimes.slice(0, 3).map((time, index) => (
                  <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {time}
                  </span>
                ))}
                {medicine.reminderTimes.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{medicine.reminderTimes.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Adherence Rate */}
            {medicine.totalDoses > 0 && (
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  adherenceRate >= 90 ? 'text-green-600 dark:text-green-400' :
                  adherenceRate >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {adherenceRate.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">adherence</div>
              </div>
            )}
            
            {isExpanded ? (
              <ChevronDown size={20} className="text-gray-400" />
            ) : (
              <ChevronRight size={20} className="text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onEdit(medicine)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Edit medicine"
            >
              <Edit3 size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={() => onDelete(medicine.id)}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              title="Delete medicine"
            >
              <Trash2 size={16} className="text-red-600 dark:text-red-400" />
            </button>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Schedule</h5>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Started: {medicine.startDate.toLocaleDateString()}
                </p>
                {medicine.endDate && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Ends: {medicine.endDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Statistics</h5>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Total doses: {medicine.totalDoses}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Missed: {medicine.missedDoses}
                </p>
              </div>
            </div>
          </div>

          {/* All Reminder Times */}
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Reminder Times</h5>
            <div className="flex flex-wrap gap-2">
              {medicine.reminderTimes.map((time, index) => (
                <span key={index} className="text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg">
                  {time}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {medicine.notes && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {medicine.notes}
              </p>
            </div>
          )}

          {/* Side Effects */}
          {medicine.sideEffects && medicine.sideEffects.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <AlertTriangle size={16} className="mr-2 text-yellow-600 dark:text-yellow-400" />
                Side Effects to Watch
              </h5>
              <div className="flex flex-wrap gap-2">
                {medicine.sideEffects.map((effect, index) => (
                  <span key={index} className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Food Interactions */}
          {medicine.foodInteractions && medicine.foodInteractions.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Utensils size={16} className="mr-2 text-red-600 dark:text-red-400" />
                Food Interactions
              </h5>
              <div className="flex flex-wrap gap-2">
                {medicine.foodInteractions.map((interaction, index) => (
                  <span key={index} className="text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                    {interaction}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}