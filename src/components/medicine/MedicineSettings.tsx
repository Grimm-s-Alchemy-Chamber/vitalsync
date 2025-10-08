import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Vibrate, Clock, Moon, Save } from 'lucide-react';
import { MedicineSchedule } from '../../types/medicine';
import { medicineApi } from '../../services/medicineApi';

export function MedicineSettings() {
  const [schedule, setSchedule] = useState<MedicineSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const scheduleData = await medicineApi.getSchedule();
      setSchedule(scheduleData);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<MedicineSchedule['preferences']>) => {
    if (!schedule) return;

    try {
      setSaving(true);
      await medicineApi.updateSchedulePreferences(updates);
      setSchedule(prev => prev ? {
        ...prev,
        preferences: { ...prev.preferences, ...updates }
      } : null);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading settings...</p>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Bell className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
          Notification Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center space-x-3">
              <Volume2 className="text-green-600 dark:text-green-400" size={20} />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Sound Alerts</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Play sound for reminders</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={schedule.preferences.reminderSound}
                onChange={(e) => updatePreferences({ reminderSound: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center space-x-3">
              <Vibrate className="text-purple-600 dark:text-purple-400" size={20} />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Vibration</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Vibrate device for reminders</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={schedule.preferences.vibration}
                onChange={(e) => updatePreferences({ vibration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Snooze Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="mr-2 text-orange-600 dark:text-orange-400" size={20} />
          Snooze Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Snooze Duration (minutes)
            </label>
            <select
              value={schedule.preferences.snoozeMinutes}
              onChange={(e) => updatePreferences({ snoozeMinutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Snoozes
            </label>
            <select
              value={schedule.preferences.maxSnoozes}
              onChange={(e) => updatePreferences({ maxSnoozes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={1}>1 time</option>
              <option value={2}>2 times</option>
              <option value={3}>3 times</option>
              <option value={5}>5 times</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Moon className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
          Quiet Hours
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          No sound or vibration during these hours (visual notifications only)
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={schedule.preferences.quietHours.start}
              onChange={(e) => updatePreferences({ 
                quietHours: { 
                  ...schedule.preferences.quietHours, 
                  start: e.target.value 
                } 
              })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={schedule.preferences.quietHours.end}
              onChange={(e) => updatePreferences({ 
                quietHours: { 
                  ...schedule.preferences.quietHours, 
                  end: e.target.value 
                } 
              })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Meal Integration */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
          🍽️ Meal Integration
        </h3>
        
        <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <p>
            <strong>Smart Reminders:</strong> When you log meals, we'll automatically remind you to take medicines based on your meal timing preferences.
          </p>
          <p>
            <strong>Before Meal:</strong> Get reminded X minutes before your scheduled meal time.
          </p>
          <p>
            <strong>After Meal:</strong> Get reminded X minutes after you log a meal.
          </p>
          <p>
            <strong>With Meal:</strong> Get reminded when you log a meal of the specified type.
          </p>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Data & Privacy
        </h3>
        
        <div className="space-y-3">
          <button className="w-full p-3 text-left bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <div className="font-medium text-blue-700 dark:text-blue-300">Export Medicine Data</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Download your medicine history and statistics</div>
          </button>

          <button className="w-full p-3 text-left bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
            <div className="font-medium text-yellow-700 dark:text-yellow-300">Reset All Data</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Clear all medicine data and start fresh</div>
          </button>
        </div>
      </div>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Save size={16} />
          <span>Settings saved!</span>
        </div>
      )}
    </div>
  );
}