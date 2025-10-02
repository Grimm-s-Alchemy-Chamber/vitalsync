import React, { useState } from 'react';
import { User, Target, Activity, Calendar, Award, TrendingUp, Settings, Brain, Pill, ExternalLink, Info } from 'lucide-react';
import { User as UserType, MacroTargets } from '../../types';
import { MacroTargetsView } from './MacroTargetsView';
import { PreferencesView } from '../preferences/PreferencesView';
import { ProfileEditView } from './ProfileEditView';
import { MedicineView } from '../medicine/MedicineView';
import { AboutView } from './AboutView';

interface ProfileViewProps {
    user: UserType;
    macroTargets: MacroTargets;
    onEditProfile: () => void;
    onUpdateUser?: (updatedUser: UserType) => void;
}

const goalLabels = {
    lose_weight: 'Lose Weight',
    gain_weight: 'Gain Weight',
    maintain: 'Maintain Weight',
    build_muscle: 'Build Muscle',
};

const activityLabels = {
    sedentary: 'Sedentary',
    light: 'Light Activity',
    moderate: 'Moderate',
    active: 'Active',
    very_active: 'Very Active',
};

const activityDescriptions = {
    sedentary: 'Little to no exercise',
    light: 'Light exercise 1-3 days/week',
    moderate: 'Moderate exercise 3-5 days/week',
    active: 'Hard exercise 6-7 days/week',
    very_active: 'Physical job + exercise',
};

const activityEmojis = {
    sedentary: '🪑',
    light: '🚶',
    moderate: '🏃',
    active: '🏋️',
    very_active: '⚡',
};

export function ProfileView({ user, macroTargets, onEditProfile, onUpdateUser }: ProfileViewProps) {
    const [activeSection, setActiveSection] = useState<'overview' | 'macros' | 'preferences' | 'edit' | 'medicine' | 'about'>('overview');

    const bmi = user.weight / ((user.height / 100) ** 2);
    const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

    const memberSince = user.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    const handleEditProfile = () => {
        setActiveSection('edit');
    };

    const handleSaveProfile = (updatedUser: UserType) => {
        if (onUpdateUser) {
            onUpdateUser(updatedUser);
        }
        setActiveSection('overview');
    };

    if (activeSection === 'macros') {
        return (
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setActiveSection('overview')}
                        className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                        <span>← Back to Profile</span>
                    </button>
                </div>
                <MacroTargetsView user={user} targets={macroTargets} />
            </div>
        );
    }

    if (activeSection === 'preferences') {
        return (
            <PreferencesView onBack={() => setActiveSection('overview')} />
        );
    }

    if (activeSection === 'edit') {
        return (
            <ProfileEditView
                user={user}
                onBack={() => setActiveSection('overview')}
                onSave={handleSaveProfile}
            />
        );
    }

    if (activeSection === 'medicine') {
        return (
            <MedicineView onBack={() => setActiveSection('overview')} />
        );
    }

    if (activeSection === 'about') {
        return (
            <AboutView onBack={() => setActiveSection('overview')} />
        );
    }

    return (
        <div className="p-4 space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <User size={32} />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <p className="text-purple-200">{user.email}</p>
                        <p className="text-purple-200 text-sm">Member since {memberSince}</p>
                    </div>
                </div>

                <button
                    onClick={handleEditProfile}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-2 px-4 font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                    <Settings size={18} />
                    <span>Edit Profile</span>
                </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setActiveSection('macros')}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="flex items-center space-x-3 mb-2">
                        <Target className="text-purple-600 dark:text-purple-400" size={20} />
                        <span className="font-semibold text-gray-900 dark:text-white">Macro Targets</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {macroTargets.calories} cal • {macroTargets.protein}g protein
                    </p>
                </button>

                <button
                    onClick={() => setActiveSection('medicine')}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="flex items-center space-x-3 mb-2">
                        <Pill className="text-green-600 dark:text-green-400" size={20} />
                        <span className="font-semibold text-gray-900 dark:text-white">Medicine Tracker</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reminders & meal timing
                    </p>
                </button>
            </div>

            {/* Additional Quick Actions */}
            <div className="grid grid-cols-1 gap-3">
                <button
                    onClick={() => setActiveSection('preferences')}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="flex items-center space-x-3 mb-2">
                        <Brain className="text-blue-600 dark:text-blue-400" size={20} />
                        <span className="font-semibold text-gray-900 dark:text-white">Smart Preferences</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        AI-learned preferences and custom foods
                    </p>
                </button>

                <button
                    onClick={() => setActiveSection('about')}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="flex items-center space-x-3 mb-2">
                        <Info className="text-indigo-600 dark:text-indigo-400" size={20} />
                        <span className="font-semibold text-gray-900 dark:text-white">About & Credits</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        App info, technology stack, and acknowledgments
                    </p>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.height}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Height (cm)</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.weight}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Weight (kg)</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.age}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Age (years)</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{bmi.toFixed(1)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">BMI</div>
                        <div className={`text-xs mt-1 ${bmiCategory === 'Normal' ? 'text-green-600 dark:text-green-400' :
                                bmiCategory === 'Underweight' ? 'text-blue-600 dark:text-blue-400' :
                                    'text-orange-600 dark:text-orange-400'
                            }`}>
                            {bmiCategory}
                        </div>
                    </div>
                </div>
            </div>

            {/* Goals & Activity */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <Target className="text-purple-600" size={20} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Fitness Goal</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-8">
                        {goalLabels[user.goal]}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <Activity className="text-blue-600" size={20} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Activity Level</h3>
                    </div>

                    {/* Activity Level Display */}
                    <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">{activityEmojis[user.activityLevel]}</span>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                                {activityLabels[user.activityLevel]}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {activityDescriptions[user.activityLevel]}
                            </div>
                        </div>
                    </div>

                    {/* Activity Profile Summary - Flattened Structure */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm flex items-center">
                            <Activity size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                            Your Activity Profile Summary
                        </h4>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Base Level</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {activityLabels[user.activityLevel]}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Workout Type</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Moderate
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Frequency</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    3 days/week
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Job Type</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Desk Job
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="mr-2 text-yellow-600" size={20} />
                    This Week
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">0</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Workouts</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">0</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Meals Logged</div>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="mr-2 text-green-600" size={20} />
                    Progress
                </h3>

                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Start logging meals and workouts to see your progress!
                    </p>
                </div>
            </div>

            {/* Built with Bolt.new Badge */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div className="text-center">
                    <a
                        href="https://bolt.new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
                    >
                        <span>⚡</span>
                        <span>Built with Bolt.new</span>
                        <ExternalLink size={14} />
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Powered by AI-driven development
                    </p>
                </div>
            </div>
        </div>
    );
}