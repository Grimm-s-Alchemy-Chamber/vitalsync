import React, { useState, useRef } from 'react';
import { X, Save, Camera, User as UserIcon, Target, Activity, Calendar, Globe, Palette } from 'lucide-react';
import { User } from '../../types';

interface ProfileEditModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

interface ExtendedUser extends User {
    workoutType?: 'light' | 'moderate' | 'intense';
    workoutDaysPerWeek?: number;
    jobType?: 'sedentary' | 'light_physical' | 'moderate_physical' | 'heavy_physical';
}

const genderOptions = [
    { value: 'male', label: 'Male', emoji: '👨' },
    { value: 'female', label: 'Female', emoji: '👩' },
    { value: 'other', label: 'Other', emoji: '🧑' },
];

const goalOptions = [
    { value: 'lose_weight', label: 'Lose Weight', emoji: '📉', description: 'Create a caloric deficit' },
    { value: 'gain_weight', label: 'Gain Weight', emoji: '📈', description: 'Build mass and strength' },
    { value: 'maintain', label: 'Maintain Weight', emoji: '⚖️', description: 'Stay at current weight' },
    { value: 'build_muscle', label: 'Build Muscle', emoji: '💪', description: 'Focus on muscle growth' },
];

const baseActivityOptions = [
    { value: 'sedentary', label: 'Sedentary', emoji: '🪑', description: 'Little to no exercise' },
    { value: 'light', label: 'Light Activity', emoji: '🚶', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', emoji: '🏃', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', emoji: '🏋️', description: 'Hard exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', emoji: '⚡', description: 'Physical job + exercise' },
];

const workoutTypeOptions = [
    { value: 'light', label: 'Light', emoji: '🚶', description: 'Walking, yoga, stretching' },
    { value: 'moderate', label: 'Moderate', emoji: '🏃', description: 'Jogging, cycling, swimming' },
    { value: 'intense', label: 'Intense', emoji: '🏋️', description: 'HIIT, heavy lifting, sports' },
];

const jobTypeOptions = [
    { value: 'sedentary', label: 'Desk Job', emoji: '💻', description: 'Office work, sitting most of the day' },
    { value: 'light_physical', label: 'Light Physical', emoji: '🚶', description: 'Teaching, retail, light standing' },
    { value: 'moderate_physical', label: 'Moderate Physical', emoji: '🔧', description: 'Nursing, warehouse, walking/lifting' },
    { value: 'heavy_physical', label: 'Heavy Physical', emoji: '🏗️', description: 'Construction, farming, manual labor' },
];

export function ProfileEditModal({ user, isOpen, onClose, onSave }: ProfileEditModalProps) {
    const [editedUser, setEditedUser] = useState<ExtendedUser>({
        ...user,
        workoutType: 'moderate',
        workoutDaysPerWeek: 3,
        jobType: 'sedentary',
    });
    const [activeTab, setActiveTab] = useState<'basic' | 'fitness' | 'preferences'>('basic');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showDetailedActivity, setShowDetailedActivity] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        // Validate required fields
        if (!editedUser.name.trim()) {
            alert('Name is required');
            return;
        }

        if (!editedUser.email.trim()) {
            alert('Email is required');
            return;
        }

        if (editedUser.height < 100 || editedUser.height > 250) {
            alert('Height must be between 100-250 cm');
            return;
        }

        if (editedUser.weight < 30 || editedUser.weight > 300) {
            alert('Weight must be between 30-300 kg');
            return;
        }

        if (editedUser.age < 13 || editedUser.age > 120) {
            alert('Age must be between 13-120 years');
            return;
        }

        // Remove extended fields before saving
        const { workoutType, workoutDaysPerWeek, jobType, ...userToSave } = editedUser;
        onSave(userToSave);
        onClose();
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setProfileImage(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateField = (field: keyof ExtendedUser, value: any) => {
        setEditedUser(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'basic', label: 'Basic', icon: UserIcon, color: 'text-blue-600 dark:text-blue-400' },
        { id: 'fitness', label: 'Fitness', icon: Target, color: 'text-green-600 dark:text-green-400' },
        { id: 'preferences', label: 'Settings', icon: Palette, color: 'text-purple-600 dark:text-purple-400' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <UserIcon size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Edit Profile</h2>
                            <p className="text-purple-200 text-sm">Update your information</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Navigation - Reduced Height */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-2 transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Icon size={16} />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {activeTab === 'basic' && (
                            <div className="space-y-4">
                                {/* Profile Picture */}
                                <div className="text-center">
                                    <div className="relative inline-block mb-3">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                                            {profileImage ? (
                                                <img
                                                    src={profileImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon size={24} className="text-white" />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 p-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                                        >
                                            <Camera size={10} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Tap to change photo
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={editedUser.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={editedUser.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    {/* Physical Stats Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Height (cm) *
                                            </label>
                                            <input
                                                type="number"
                                                min="100"
                                                max="250"
                                                value={editedUser.height}
                                                onChange={(e) => updateField('height', parseInt(e.target.value) || 0)}
                                                className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                                                placeholder="175"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Weight (kg) *
                                            </label>
                                            <input
                                                type="number"
                                                min="30"
                                                max="300"
                                                value={editedUser.weight}
                                                onChange={(e) => updateField('weight', parseInt(e.target.value) || 0)}
                                                className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                                                placeholder="70"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Age *
                                            </label>
                                            <input
                                                type="number"
                                                min="13"
                                                max="120"
                                                value={editedUser.age}
                                                onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                                                className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                                                placeholder="25"
                                            />
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Gender
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {genderOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => updateField('gender', option.value)}
                                                    className={`p-2 rounded-lg border text-sm font-medium transition-all duration-200 ${editedUser.gender === option.value
                                                            ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105'
                                                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    <div className="text-lg mb-1">{option.emoji}</div>
                                                    <div className="text-xs">{option.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'fitness' && (
                            <div className="space-y-4">
                                {/* Fitness Goal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Primary Fitness Goal
                                    </label>
                                    <div className="space-y-2">
                                        {goalOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => updateField('goal', option.value)}
                                                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${editedUser.goal === option.value
                                                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 ring-2 ring-purple-500'
                                                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <span className="text-xl">{option.emoji}</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {option.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 ml-9">
                                                    {option.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Base Activity Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Base Activity Level
                                    </label>
                                    <div className="space-y-2">
                                        {baseActivityOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    updateField('activityLevel', option.value);
                                                    if (option.value !== 'sedentary') {
                                                        setShowDetailedActivity(true);
                                                    }
                                                }}
                                                className={`w-full p-2 rounded-lg border text-left transition-all duration-200 ${editedUser.activityLevel === option.value
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500'
                                                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-lg">{option.emoji}</span>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {option.label}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            {option.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Activity Settings */}
                                {(showDetailedActivity || editedUser.activityLevel !== 'sedentary') && (
                                    <div className="space-y-4 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <h4 className="font-medium text-blue-900 dark:text-blue-100 flex items-center text-sm">
                                            <Activity size={14} className="mr-2" />
                                            Detailed Activity Profile
                                        </h4>

                                        {/* Workout Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Workout Intensity
                                            </label>
                                            <div className="space-y-1">
                                                {workoutTypeOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => updateField('workoutType', option.value)}
                                                        className={`w-full p-2 rounded-lg border text-left transition-colors ${editedUser.workoutType === option.value
                                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{option.emoji}</span>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                                    {option.label}
                                                                </div>
                                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {option.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Workout Days Per Week */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Workout Days Per Week
                                            </label>
                                            <div className="grid grid-cols-7 gap-1">
                                                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                                    <button
                                                        key={days}
                                                        type="button"
                                                        onClick={() => updateField('workoutDaysPerWeek', days)}
                                                        className={`p-2 rounded-lg border text-center transition-all duration-200 ${editedUser.workoutDaysPerWeek === days
                                                                ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105'
                                                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        <div className="font-bold text-sm">{days}</div>
                                                        <div className="text-xs">day{days !== 1 ? 's' : ''}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Job Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Job Type / Daily Activity
                                            </label>
                                            <div className="space-y-1">
                                                {jobTypeOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => updateField('jobType', option.value)}
                                                        className={`w-full p-2 rounded-lg border text-left transition-colors ${editedUser.jobType === option.value
                                                                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{option.emoji}</span>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                                    {option.label}
                                                                </div>
                                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {option.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Activity Summary */}
                                        <div className="bg-white dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                                Your Activity Profile
                                            </h5>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                                <p>• Base Level: {baseActivityOptions.find(o => o.value === editedUser.activityLevel)?.label}</p>
                                                <p>• Workout Type: {workoutTypeOptions.find(o => o.value === editedUser.workoutType)?.label}</p>
                                                <p>• Frequency: {editedUser.workoutDaysPerWeek} days/week</p>
                                                <p>• Job Type: {jobTypeOptions.find(o => o.value === editedUser.jobType)?.label}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-4">
                                {/* Units */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Measurement Units
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            type="button"
                                            className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-left"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Globe size={18} className="text-blue-600 dark:text-blue-400" />
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">Metric System</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">kg, cm, °C, liters</div>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-left opacity-50 cursor-not-allowed"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Globe size={18} className="text-gray-400" />
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">Imperial System</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">lbs, ft, °F (Coming Soon)</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Notifications
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'meals', label: 'Meal Reminders', desc: 'Get reminded to log your meals' },
                                            { key: 'workouts', label: 'Workout Reminders', desc: 'Get reminded to exercise' },
                                            { key: 'progress', label: 'Progress Updates', desc: 'Weekly progress summaries' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Privacy */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Privacy & Data
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'analytics', label: 'Data Analytics', desc: 'Help improve the app with usage data' },
                                            { key: 'marketing', label: 'Marketing Communications', desc: 'Receive tips and feature updates' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={item.key === 'analytics'}
                                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Account Actions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Account Actions
                                    </label>
                                    <div className="space-y-1">
                                        <button className="w-full p-2 text-left bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                            <div className="font-medium text-blue-700 dark:text-blue-300 text-sm">Export Data</div>
                                            <div className="text-xs text-blue-600 dark:text-blue-400">Download your fitness data</div>
                                        </button>

                                        <button className="w-full p-2 text-left bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                                            <div className="font-medium text-yellow-700 dark:text-yellow-300 text-sm">Reset Preferences</div>
                                            <div className="text-xs text-yellow-600 dark:text-yellow-400">Clear all learned preferences</div>
                                        </button>

                                        <button className="w-full p-2 text-left bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                            <div className="font-medium text-red-700 dark:text-red-300 text-sm">Delete Account</div>
                                            <div className="text-xs text-red-600 dark:text-red-400">Permanently delete your account</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Cancel and Submit Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-700 rounded-b-2xl">
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl font-medium"
                        >
                            <Save size={16} />
                            <span>Submit</span>
                        </button>
                    </div>

                    {/* Member Since Info */}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                        Member since {user.createdAt.toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}