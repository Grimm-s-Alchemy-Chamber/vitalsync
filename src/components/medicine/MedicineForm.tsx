import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Plus, Trash2, Clock, Utensils, AlertTriangle, Info, ChevronDown, Check, Calendar, ChevronUp } from 'lucide-react';
import { Medicine } from '../../types/medicine';

interface MedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: Omit<Medicine, 'id' | 'createdAt' | 'missedDoses' | 'totalDoses'>) => void;
  editingMedicine?: Medicine | null;
}

const frequencyOptions = [
  { value: 'once_daily', label: 'Once Daily', times: 1, emoji: '1️⃣', description: 'Take once per day' },
  { value: 'twice_daily', label: 'Twice Daily', times: 2, emoji: '2️⃣', description: 'Take twice per day' },
  { value: 'three_times_daily', label: 'Three Times Daily', times: 3, emoji: '3️⃣', description: 'Take three times per day' },
  { value: 'four_times_daily', label: 'Four Times Daily', times: 4, emoji: '4️⃣', description: 'Take four times per day' },
  { value: 'every_other_day', label: 'Every Other Day', times: 0.5, emoji: '📅', description: 'Take every 48 hours' },
  { value: 'weekly', label: 'Weekly', times: 0.14, emoji: '📆', description: 'Take once per week' },
  { value: 'monthly', label: 'Monthly', times: 0.03, emoji: '🗓️', description: 'Take once per month' },
  { value: 'as_needed', label: 'As Needed', times: 0, emoji: '🔄', description: 'Take when required' },
  { value: 'custom', label: 'Custom Schedule', times: 0, emoji: '⚙️', description: 'Set custom timing' },
];

const timingOptions = [
  { value: 'before_meal', label: 'Before Meal', emoji: '🍽️', description: 'Take before eating', color: 'from-blue-500 to-cyan-500' },
  { value: 'after_meal', label: 'After Meal', emoji: '🍽️', description: 'Take after eating', color: 'from-green-500 to-emerald-500' },
  { value: 'with_meal', label: 'With Meal', emoji: '🍽️', description: 'Take while eating', color: 'from-orange-500 to-amber-500' },
  { value: 'empty_stomach', label: 'Empty Stomach', emoji: '⏰', description: 'Take on empty stomach', color: 'from-purple-500 to-violet-500' },
  { value: 'anytime', label: 'Anytime', emoji: '🕐', description: 'No meal timing required', color: 'from-gray-500 to-slate-500' },
];

const mealTypeOptions = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅', color: 'from-yellow-400 to-orange-400' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️', color: 'from-green-400 to-emerald-400' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙', color: 'from-blue-400 to-indigo-400' },
  { value: 'any_meal', label: 'Any Meal', emoji: '🍽️', color: 'from-purple-400 to-pink-400' },
];

const unitOptions = [
  { value: 'mg', label: 'mg', emoji: '⚖️' },
  { value: 'ml', label: 'ml', emoji: '💧' },
  { value: 'tablets', label: 'tablets', emoji: '💊' },
  { value: 'capsules', label: 'capsules', emoji: '💊' },
  { value: 'drops', label: 'drops', emoji: '💧' },
  { value: 'puffs', label: 'puffs', emoji: '💨' },
  { value: 'units', label: 'units', emoji: '📏' },
];

const reminderIntervals = [
  { value: 5, label: '5 minutes before' },
  { value: 10, label: '10 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
];

export function MedicineForm({ isOpen, onClose, onSave, editingMedicine }: MedicineFormProps) {
  const [formData, setFormData] = useState({
    name: editingMedicine?.name || '',
    dosage: editingMedicine?.dosage || '',
    unit: editingMedicine?.unit || 'mg' as Medicine['unit'],
    frequency: editingMedicine?.frequency || 'once_daily' as Medicine['frequency'],
    customFrequency: editingMedicine?.customFrequency || {
      times: 1,
      interval: 'hours' as 'hours' | 'days' | 'weeks',
    },
    timing: editingMedicine?.timing || 'anytime' as Medicine['timing'],
    mealType: editingMedicine?.mealType || 'any_meal' as Medicine['mealType'],
    timingOffset: editingMedicine?.timingOffset || 0,
    reminderTimes: editingMedicine?.reminderTimes || ['08:00'],
    startDate: editingMedicine?.startDate || new Date(),
    endDate: editingMedicine?.endDate || undefined as Date | undefined,
    isActive: editingMedicine?.isActive ?? true,
    notes: editingMedicine?.notes || '',
    sideEffects: editingMedicine?.sideEffects || [] as string[],
    foodInteractions: editingMedicine?.foodInteractions || [] as string[],
  });

  const [newSideEffect, setNewSideEffect] = useState('');
  const [newFoodInteraction, setNewFoodInteraction] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [reminderInterval, setReminderInterval] = useState(15);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<number | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState({ hours: 8, minutes: 0 });
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  // Close dropdown when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOpenDropdown(null);
      setShowDatePicker(null);
      setShowTimePicker(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Medicine name is required');
      return;
    }

    if (!formData.dosage.trim()) {
      alert('Dosage is required');
      return;
    }

    if (formData.reminderTimes.length === 0 && formData.frequency !== 'as_needed') {
      alert('At least one reminder time is required');
      return;
    }

    onSave(formData);
  };

  const updateReminderTimes = (frequency: Medicine['frequency']) => {
    const selectedFreq = frequencyOptions.find(f => f.value === frequency);
    if (!selectedFreq || selectedFreq.times === 0) return;

    const times: string[] = [];
    
    if (frequency === 'every_other_day') {
      times.push('08:00');
    } else if (frequency === 'weekly') {
      times.push('08:00');
    } else if (frequency === 'monthly') {
      times.push('08:00');
    } else {
      const hoursInterval = 24 / selectedFreq.times;
      for (let i = 0; i < selectedFreq.times; i++) {
        const hour = Math.floor(8 + (i * hoursInterval)) % 24;
        times.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    }

    setFormData(prev => ({ ...prev, reminderTimes: times }));
  };

  const addReminderTime = () => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, '12:00']
    }));
  };

  const updateReminderTime = (index: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.map((t, i) => i === index ? time : t)
    }));
  };

  const removeReminderTime = (index: number) => {
    if (formData.reminderTimes.length > 1) {
      setFormData(prev => ({
        ...prev,
        reminderTimes: prev.reminderTimes.filter((_, i) => i !== index)
      }));
    }
  };

  const addSideEffect = () => {
    if (newSideEffect.trim()) {
      setFormData(prev => ({
        ...prev,
        sideEffects: [...prev.sideEffects, newSideEffect.trim()]
      }));
      setNewSideEffect('');
    }
  };

  const removeSideEffect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sideEffects: prev.sideEffects.filter((_, i) => i !== index)
    }));
  };

  const addFoodInteraction = () => {
    if (newFoodInteraction.trim()) {
      setFormData(prev => ({
        ...prev,
        foodInteractions: [...prev.foodInteractions, newFoodInteraction.trim()]
      }));
      setNewFoodInteraction('');
    }
  };

  const removeFoodInteraction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      foodInteractions: prev.foodInteractions.filter((_, i) => i !== index)
    }));
  };

  const handleDateConfirm = () => {
    if (showDatePicker === 'start') {
      setFormData(prev => ({ ...prev, startDate: tempDate }));
    } else if (showDatePicker === 'end') {
      setFormData(prev => ({ ...prev, endDate: tempDate }));
    }
    setShowDatePicker(null);
  };

  const handleTimeConfirm = (index: number) => {
    const timeString = `${tempTime.hours.toString().padStart(2, '0')}:${tempTime.minutes.toString().padStart(2, '0')}`;
    updateReminderTime(index, timeString);
    setShowTimePicker(null);
  };

  const openTimePicker = (index: number) => {
    const currentTime = formData.reminderTimes[index];
    const [hours, minutes] = currentTime.split(':').map(Number);
    setTempTime({ hours, minutes });
    setShowTimePicker(index);
  };

  const adjustTime = (type: 'hours' | 'minutes', direction: 'up' | 'down') => {
    setTempTime(prev => {
      if (type === 'hours') {
        const newHours = direction === 'up' 
          ? (prev.hours + 1) % 24 
          : (prev.hours - 1 + 24) % 24;
        return { ...prev, hours: newHours };
      } else {
        const newMinutes = direction === 'up' 
          ? (prev.minutes + 15) % 60 
          : (prev.minutes - 15 + 60) % 60;
        return { ...prev, minutes: newMinutes };
      }
    });
  };

  const setQuickTime = (hours: number, minutes: number) => {
    setTempTime({ hours, minutes });
  };

  const ModernDropdown = ({ 
    id, 
    label, 
    value, 
    options, 
    onChange, 
    placeholder = "Select option",
    renderOption,
    renderSelected
  }: {
    id: string;
    label: string;
    value: any;
    options: any[];
    onChange: (value: any) => void;
    placeholder?: string;
    renderOption?: (option: any) => React.ReactNode;
    renderSelected?: (option: any) => React.ReactNode;
  }) => {
    const isOpen = openDropdown === id;
    const selectedOption = options.find(opt => opt.value === value);

    return (
      <div className="relative" ref={el => dropdownRefs.current[id] = el}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
        
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : id)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {selectedOption ? (
                renderSelected ? renderSelected(selectedOption) : (
                  <div className="flex items-center space-x-3">
                    {selectedOption.emoji && <span className="text-lg">{selectedOption.emoji}</span>}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedOption.label}
                      </div>
                      {selectedOption.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedOption.description}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
              )}
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Enhanced Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpenDropdown(null);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 ${
                  value === option.value ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
              >
                {renderOption ? renderOption(option) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {option.emoji && <span className="text-lg">{option.emoji}</span>}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {value === option.value && (
                      <Check size={16} className="text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ModernDateInput = ({ 
    label, 
    value, 
    onChange, 
    required = false,
    type = 'start'
  }: {
    label: string;
    value: Date | undefined;
    onChange: (value: Date | undefined) => void;
    required?: boolean;
    type?: 'start' | 'end';
  }) => {
    const openDatePicker = () => {
      setTempDate(value || new Date());
      setShowDatePicker(type);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && '*'}
        </label>
        <button
          type="button"
          onClick={openDatePicker}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between"
        >
          <span>{value?.toLocaleDateString() || 'Select date'}</span>
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </button>
      </div>
    );
  };

  const ModernTimeInput = ({ 
    label, 
    value, 
    onChange, 
    onRemove, 
    canRemove = false,
    index
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onRemove?: () => void;
    canRemove?: boolean;
    index: number;
  }) => {
    return (
      <div className="relative">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => openTimePicker(index)}
            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between"
          >
            <span>{value}</span>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-400" />
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </button>
          {canRemove && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Date Picker Modal
  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    const currentDate = tempDate;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const navigateMonth = (direction: 'prev' | 'next') => {
      const newDate = new Date(currentDate);
      if (direction === 'prev') {
        newDate.setMonth(month - 1);
      } else {
        newDate.setMonth(month + 1);
      }
      setTempDate(newDate);
    };

    const selectDate = (day: number) => {
      const newDate = new Date(year, month, day);
      setTempDate(newDate);
    };

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const isSelected = tempDate.getDate() === day && tempDate.getMonth() === month && tempDate.getFullYear() === year;
      
      days.push(
        <button
          key={day}
          onClick={() => selectDate(day)}
          className={`h-12 w-12 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isSelected
              ? 'bg-purple-600 text-white shadow-lg'
              : isToday
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-3xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Calendar size={24} />
                <div>
                  <h3 className="text-lg font-bold">Select Date</h3>
                  <p className="text-purple-200 text-sm">Choose your date</p>
                </div>
              </div>
              <button
                onClick={() => setShowDatePicker(null)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronDown size={20} className="text-gray-600 dark:text-gray-400 rotate-90" />
              </button>
              
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {monthNames[month]} {year}
              </h4>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronDown size={20} className="text-gray-600 dark:text-gray-400 -rotate-90" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {days}
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setTempDate(new Date());
                }}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setTempDate(tomorrow);
                }}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-b-3xl">
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDatePicker(null)}
                className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDateConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Time Picker Modal
  const renderTimePicker = () => {
    if (showTimePicker === null) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-3xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Clock size={24} />
                <div>
                  <h3 className="text-lg font-bold">Select Time</h3>
                  <p className="text-purple-200 text-sm">Choose reminder time</p>
                </div>
              </div>
              <button
                onClick={() => setShowTimePicker(null)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Time Display */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {tempTime.hours.toString().padStart(2, '0')}:{tempTime.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {tempTime.hours < 12 ? 'AM' : 'PM'} • {tempTime.hours === 0 ? 12 : tempTime.hours > 12 ? tempTime.hours - 12 : tempTime.hours}:{tempTime.minutes.toString().padStart(2, '0')} {tempTime.hours < 12 ? 'AM' : 'PM'}
              </div>
            </div>

            {/* Time Controls */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Hours */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Hours</label>
                <div className="space-y-2">
                  <button
                    onClick={() => adjustTime('hours', 'up')}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    <ChevronUp size={20} className="mx-auto text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white py-2">
                    {tempTime.hours.toString().padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => adjustTime('hours', 'down')}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    <ChevronDown size={20} className="mx-auto text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Minutes */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Minutes</label>
                <div className="space-y-2">
                  <button
                    onClick={() => adjustTime('minutes', 'up')}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    <ChevronUp size={20} className="mx-auto text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white py-2">
                    {tempTime.minutes.toString().padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => adjustTime('minutes', 'down')}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    <ChevronDown size={20} className="mx-auto text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Time Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { hours: 8, minutes: 0, label: '08:00' },
                { hours: 12, minutes: 0, label: '12:00' },
                { hours: 18, minutes: 0, label: '18:00' },
                { hours: 22, minutes: 0, label: '22:00' },
              ].map((time) => (
                <button
                  key={time.label}
                  onClick={() => setQuickTime(time.hours, time.minutes)}
                  className="py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg text-sm font-medium transition-colors"
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-b-3xl">
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTimePicker(null)}
                className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTimeConfirm(showTimePicker)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const needsMealType = ['before_meal', 'after_meal', 'with_meal'].includes(formData.timing);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Utensils size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                  </h3>
                  <p className="text-purple-200 text-sm">Set up reminders and meal timing</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Basic Information</h4>
              </div>
              
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  placeholder="e.g., Vitamin D3, Aspirin"
                />
              </div>

              {/* Dosage and Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    placeholder="e.g., 500, 1"
                  />
                </div>

                <ModernDropdown
                  id="unit"
                  label="Unit"
                  value={formData.unit}
                  options={unitOptions}
                  onChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                />
              </div>
            </div>

            {/* Enhanced Frequency Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Frequency & Schedule</h4>
              </div>
              
              <ModernDropdown
                id="frequency"
                label="How often do you take this medicine?"
                value={formData.frequency}
                options={frequencyOptions}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, frequency: value }));
                  updateReminderTimes(value);
                }}
              />

              {formData.frequency === 'custom' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl space-y-3">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100">Custom Schedule</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Times
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.customFrequency.times}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          customFrequency: {
                            ...prev.customFrequency,
                            times: parseInt(e.target.value) || 1
                          }
                        }))}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                    <ModernDropdown
                      id="interval"
                      label="Per"
                      value={formData.customFrequency.interval}
                      options={[
                        { value: 'hours', label: 'Hours', emoji: '⏰' },
                        { value: 'days', label: 'Days', emoji: '📅' },
                        { value: 'weeks', label: 'Weeks', emoji: '📆' },
                      ]}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        customFrequency: {
                          ...prev.customFrequency,
                          interval: value
                        }
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Meal Timing Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Utensils className="text-orange-600 dark:text-orange-400" size={16} />
                <h4 className="font-semibold text-gray-900 dark:text-white">Meal Timing</h4>
              </div>
              
              <ModernDropdown
                id="timing"
                label="When should you take this medicine?"
                value={formData.timing}
                options={timingOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, timing: value }))}
                renderOption={(option) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                        <span className="text-white text-sm">{option.emoji}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                      </div>
                    </div>
                    {formData.timing === option.value && (
                      <Check size={16} className="text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                )}
                renderSelected={(option) => (
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                      <span className="text-white text-sm">{option.emoji}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                    </div>
                  </div>
                )}
              />

              {needsMealType && (
                <ModernDropdown
                  id="mealType"
                  label="Which meal?"
                  value={formData.mealType}
                  options={mealTypeOptions}
                  onChange={(value) => setFormData(prev => ({ ...prev, mealType: value }))}
                  renderOption={(option) => (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                          <span className="text-white text-sm">{option.emoji}</span>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                      </div>
                      {formData.mealType === option.value && (
                        <Check size={16} className="text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                  )}
                  renderSelected={(option) => (
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                        <span className="text-white text-sm">{option.emoji}</span>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                    </div>
                  )}
                />
              )}

              {(formData.timing === 'before_meal' || formData.timing === 'after_meal') && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    Time offset (minutes)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 30, 60].map((minutes) => (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, timingOffset: minutes }))}
                        className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          formData.timingOffset === minutes
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                        }`}
                      >
                        {minutes}min
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.timingOffset}
                    onChange={(e) => setFormData(prev => ({ ...prev, timingOffset: parseInt(e.target.value) || 0 }))}
                    className="w-full mt-3 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                    placeholder="Custom minutes"
                  />
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                    {formData.timing === 'before_meal' ? 'Minutes before meal' : 'Minutes after meal'}
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Reminder Times */}
            {formData.frequency !== 'as_needed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-blue-600 dark:text-blue-400" size={16} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Reminder Times</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addReminderTime}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <Plus size={14} />
                    <span>Add Time</span>
                  </button>
                </div>

                {/* Reminder Interval Setting */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Reminder Alert Timing
                  </label>
                  <ModernDropdown
                    id="reminderInterval"
                    label=""
                    value={reminderInterval}
                    options={reminderIntervals}
                    onChange={setReminderInterval}
                  />
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                    You'll get an alert {reminderInterval} minutes before each scheduled time
                  </p>
                </div>

                <div className="space-y-3">
                  {formData.reminderTimes.map((time, index) => (
                    <ModernTimeInput
                      key={index}
                      label={`Reminder ${index + 1}`}
                      value={time}
                      onChange={(value) => updateReminderTime(index, value)}
                      onRemove={formData.reminderTimes.length > 1 ? () => removeReminderTime(index) : undefined}
                      canRemove={formData.reminderTimes.length > 1}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Duration */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Duration</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <ModernDateInput
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(value) => setFormData(prev => ({ ...prev, startDate: value || new Date() }))}
                  required
                  type="start"
                />

                <ModernDateInput
                  label="End Date (Optional)"
                  value={formData.endDate}
                  onChange={(value) => setFormData(prev => ({ ...prev, endDate: value }))}
                  type="end"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="text-gray-600 dark:text-gray-400" size={16} />
                <h4 className="font-semibold text-gray-900 dark:text-white">Additional Information</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  rows={3}
                  placeholder="Any special instructions or notes..."
                />
              </div>

              {/* Side Effects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Side Effects to Watch For
                </label>
                <div className="space-y-2">
                  {formData.sideEffects.map((effect, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">{effect}</span>
                      <button
                        type="button"
                        onClick={() => removeSideEffect(index)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSideEffect}
                      onChange={(e) => setNewSideEffect(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSideEffect()}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-200"
                      placeholder="e.g., Nausea, Dizziness"
                    />
                    <button
                      type="button"
                      onClick={addSideEffect}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Food Interactions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Food Interactions
                </label>
                <div className="space-y-2">
                  {formData.foodInteractions.map((interaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <span className="text-sm text-red-800 dark:text-red-200">{interaction}</span>
                      <button
                        type="button"
                        onClick={() => removeFoodInteraction(index)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFoodInteraction}
                      onChange={(e) => setNewFoodInteraction(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFoodInteraction()}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-200"
                      placeholder="e.g., Avoid dairy, Take with food"
                    />
                    <button
                      type="button"
                      onClick={addFoodInteraction}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Smart Meal Integration</p>
                  <p>When you log meals, we'll automatically remind you to take medicines based on your meal timing preferences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reduced Height Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Save size={16} />
              <span>{editingMedicine ? 'Update' : 'Save'} Medicine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Date Picker Modal */}
      {renderDatePicker()}

      {/* Render Time Picker Modal */}
      {renderTimePicker()}
    </div>
  );
}