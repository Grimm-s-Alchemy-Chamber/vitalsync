import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Camera, User as UserIcon, Target, Activity, Globe, Palette, Check, ChevronRight } from 'lucide-react';
import { User } from '../../types';

interface ProfileEditViewProps {
    user: User;
    onBack: () => void;
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

export function ProfileEditView({ user, onBack, onSave }: ProfileEditViewProps) {
    const [editedUser, setEditedUser] = useState<ExtendedUser>({
        ...user,
        workoutType: 'moderate',
        workoutDaysPerWeek: 3,
        jobType: 'sedentary',
    });
    const [activeSection, setActiveSection] = useState<'basic' | 'fitness' | 'preferences'>('basic');
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
        onBack();
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

    const sections = [
        {
            id: 'basic',
            title: 'Basic Info',
            icon: UserIcon,
            color: 'from-blue-500 to-cyan-500',
            description: 'Personal details and measurements'
        },
        {
            id: 'fitness',
            title: 'Fitness Goals',
            icon: Target,
            color: 'from-green-500 to-emerald-500',
            description: 'Goals and activity preferences'
        },
        {
            id: 'preferences',
            title: 'App Settings',
            icon: Palette,
            color: 'from-purple-500 to-pink-500',
            description: 'Notifications and privacy'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your information</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <Save size={18} />
                        <span className="font-medium">Save</span>
                    </button>
                </div>
            </div>

            {/* Profile Picture Section */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 px-4 py-8">
                <div className="text-center">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-4 border-white/30">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon size={32} className="text-white" />
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <Camera size={16} />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">{editedUser.name || 'Your Name'}</h2>
                    <p className="text-purple-200">{editedUser.email}</p>
                </div>
            </div>

            {/* Section Navigation */}
            <div className="px-4 py-6">
                <div className="space-y-3">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;

                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id as any)}
                                className={`w-full p-4 rounded-2xl border transition-all duration-200 ${isActive
                                        ? 'bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 shadow-lg scale-[1.02]'
                                        : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} shadow-lg`}>
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {section.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {section.description}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        size={20}
                                        className={`text-gray-400 transition-transform duration-200 ${isActive ? 'rotate-90 text-purple-600 dark:text-purple-400' : ''
                                            }`}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Sections */}
            <div className="px-4 pb-8">
                {activeSection === 'basic' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                            <UserIcon className="mr-3 text-blue-600 dark:text-blue-400" size={20} />
                            Basic Information
                        </h3>

                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={editedUser.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={editedUser.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Physical Stats */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Physical Measurements
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            Height (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            min="100"
                                            max="250"
                                            value={editedUser.height}
                                            onChange={(e) => updateField('height', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center transition-all duration-200"
                                            placeholder="175"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            Weight (kg) *
                                        </label>
                                        <input
                                            type="number"
                                            min="30"
                                            max="300"
                                            value={editedUser.weight}
                                            onChange={(e) => updateField('weight', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center transition-all duration-200"
                                            placeholder="70"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            Age *
                                        </label>
                                        <input
                                            type="number"
                                            min="13"
                                            max="120"
                                            value={editedUser.age}
                                            onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center transition-all duration-200"
                                            placeholder="25"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Gender
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {genderOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => updateField('gender', option.value)}
                                            className={`p-4 rounded-xl border transition-all duration-200 ${editedUser.gender === option.value
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 ring-2 ring-purple-500 scale-105'
                                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">{option.emoji}</div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'fitness' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Target className="mr-3 text-green-600 dark:text-green-400" size={20} />
                            Fitness Goals & Activity
                        </h3>

                        <div className="space-y-6">
                            {/* Fitness Goal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Primary Fitness Goal
                                </label>
                                <div className="space-y-3">
                                    {goalOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => updateField('goal', option.value)}
                                            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${editedUser.goal === option.value
                                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 ring-2 ring-green-500'
                                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-2xl">{option.emoji}</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {option.label}
                                                </span>
                                                {editedUser.goal === option.value && (
                                                    <Check size={20} className="text-green-600 dark:text-green-400 ml-auto" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
                                                {option.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Base Activity Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                                            className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${editedUser.activityLevel === option.value
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500'
                                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl">{option.emoji}</span>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {option.label}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {option.description}
                                                    </div>
                                                </div>
                                                {editedUser.activityLevel === option.value && (
                                                    <Check size={18} className="text-blue-600 dark:text-blue-400" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Activity Settings - Removed outer box */}
                            {(showDetailedActivity || editedUser.activityLevel !== 'sedentary') && (
                                <div className="space-y-6">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                                        <Activity size={18} className="mr-2" />
                                        Detailed Activity Profile
                                    </h4>

                                    {/* Workout Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Workout Intensity
                                        </label>
                                        <div className="space-y-2">
                                            {workoutTypeOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => updateField('workoutType', option.value)}
                                                    className={`w-full p-3 rounded-xl border text-left transition-colors ${editedUser.workoutType === option.value
                                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 ring-2 ring-green-500'
                                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-lg">{option.emoji}</span>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {option.label}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {option.description}
                                                            </div>
                                                        </div>
                                                        {editedUser.workoutType === option.value && (
                                                            <Check size={16} className="text-green-600 dark:text-green-400" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Workout Days Per Week */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Workout Days Per Week
                                        </label>
                                        <div className="grid grid-cols-7 gap-2">
                                            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                                <button
                                                    key={days}
                                                    type="button"
                                                    onClick={() => updateField('workoutDaysPerWeek', days)}
                                                    className={`h-16 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center ${editedUser.workoutDaysPerWeek === days
                                                            ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105'
                                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    <div className="font-bold text-lg leading-none">{days}</div>
                                                    <div className="text-xs leading-tight mt-1">day{days !== 1 ? 's' : ''}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Job Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Job Type / Daily Activity
                                        </label>
                                        <div className="space-y-2">
                                            {jobTypeOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => updateField('jobType', option.value)}
                                                    className={`w-full p-3 rounded-xl border text-left transition-colors ${editedUser.jobType === option.value
                                                            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 ring-2 ring-orange-500'
                                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-lg">{option.emoji}</span>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {option.label}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {option.description}
                                                            </div>
                                                        </div>
                                                        {editedUser.jobType === option.value && (
                                                            <Check size={16} className="text-orange-600 dark:text-orange-400" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Activity Summary */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                                            Your Activity Profile Summary
                                        </h5>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p>• Base Level: {baseActivityOptions.find(o => o.value === editedUser.activityLevel)?.label}</p>
                                            <p>• Workout Type: {workoutTypeOptions.find(o => o.value === editedUser.workoutType)?.label}</p>
                                            <p>• Frequency: {editedUser.workoutDaysPerWeek} days/week</p>
                                            <p>• Job Type: {jobTypeOptions.find(o => o.value === editedUser.jobType)?.label}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'preferences' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Palette className="mr-3 text-purple-600 dark:text-purple-400" size={20} />
                            App Settings & Preferences
                        </h3>

                        <div className="space-y-6">
                            {/* Units */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Measurement Units
                                </label>
                                <div className="space-y-2">
                                    <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700">
                                        <div className="flex items-center space-x-3">
                                            <Globe size={20} className="text-blue-600 dark:text-blue-400" />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white">Metric System</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">kg, cm, °C, liters</div>
                                            </div>
                                            <Check size={20} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50">
                                        <div className="flex items-center space-x-3">
                                            <Globe size={20} className="text-gray-400" />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white">Imperial System</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">lbs, ft, °F (Coming Soon)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Notifications
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { key: 'meals', label: 'Meal Reminders', desc: 'Get reminded to log your meals', enabled: true },
                                        { key: 'workouts', label: 'Workout Reminders', desc: 'Get reminded to exercise', enabled: true },
                                        { key: 'progress', label: 'Progress Updates', desc: 'Weekly progress summaries', enabled: false },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={item.enabled}
                                                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Privacy */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Privacy & Data
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { key: 'analytics', label: 'Data Analytics', desc: 'Help improve the app with usage data', enabled: true },
                                        { key: 'marketing', label: 'Marketing Communications', desc: 'Receive tips and feature updates', enabled: false },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={item.enabled}
                                                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Account Actions
                                </label>
                                <div className="space-y-2">
                                    <button className="w-full p-4 text-left bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                        <div className="font-medium text-blue-700 dark:text-blue-300">Export Data</div>
                                        <div className="text-sm text-blue-600 dark:text-blue-400">Download your fitness data</div>
                                    </button>

                                    <button className="w-full p-4 text-left bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                                        <div className="font-medium text-yellow-700 dark:text-yellow-300">Reset Preferences</div>
                                        <div className="text-sm text-yellow-600 dark:text-yellow-400">Clear all learned preferences</div>
                                    </button>

                                    <button className="w-full p-4 text-left bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                        <div className="font-medium text-red-700 dark:text-red-300">Delete Account</div>
                                        <div className="text-sm text-red-600 dark:text-red-400">Permanently delete your account</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Padding for Mobile */}
            <div className="h-8"></div>
        </div>
    );
}