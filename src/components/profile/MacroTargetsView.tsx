import React from 'react';
import { Target, Calculator, TrendingUp, Info } from 'lucide-react';
import { User, MacroTargets } from '../../types';
import { MacroCalculator } from '../../services/macroCalculator';

interface MacroTargetsViewProps {
    user: User;
    targets: MacroTargets;
}

const goalDescriptions = {
    lose_weight: 'Weight Loss',
    gain_weight: 'Weight Gain',
    maintain: 'Maintenance',
    build_muscle: 'Muscle Building',
};

const activityDescriptions = {
    sedentary: 'Sedentary (little/no exercise)',
    light: 'Light (1-3 days/week)',
    moderate: 'Moderate (3-5 days/week)',
    active: 'Active (6-7 days/week)',
    very_active: 'Very Active (2x/day or intense)',
};

export function MacroTargetsView({ user, targets }: MacroTargetsViewProps) {
    const bmr = MacroCalculator.calculateBMR(user);
    const tdee = MacroCalculator.calculateTDEE(user);
    const { recommendations } = MacroCalculator.getMacroRecommendations(user);

    const macroBreakdown = [
        {
            name: 'Protein',
            grams: targets.protein,
            calories: targets.protein * 4,
            percentage: ((targets.protein * 4) / targets.calories * 100).toFixed(0),
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
        },
        {
            name: 'Carbs',
            grams: targets.carbs,
            calories: targets.carbs * 4,
            percentage: ((targets.carbs * 4) / targets.calories * 100).toFixed(0),
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
        },
        {
            name: 'Fat',
            grams: targets.fat,
            calories: targets.fat * 9,
            percentage: ((targets.fat * 9) / targets.calories * 100).toFixed(0),
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            borderColor: 'border-indigo-200 dark:border-indigo-800',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                    <Target size={24} />
                    <h2 className="text-xl font-bold">Your Macro Targets</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-purple-200">Goal:</span>
                        <div className="font-medium">{goalDescriptions[user.goal]}</div>
                    </div>
                    <div>
                        <span className="text-purple-200">Activity:</span>
                        <div className="font-medium">{activityDescriptions[user.activityLevel]}</div>
                    </div>
                </div>
            </div>

            {/* Daily Targets */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calculator className="mr-2" size={20} />
                    Daily Targets
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {targets.calories}
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">Total Calories</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                            {tdee}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Maintenance</div>
                    </div>
                </div>

                {/* Macro Breakdown */}
                <div className="space-y-3">
                    {macroBreakdown.map((macro) => (
                        <div
                            key={macro.name}
                            className={`p-4 rounded-xl border ${macro.bgColor} ${macro.borderColor}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className={`font-semibold ${macro.color}`}>{macro.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {macro.grams}g • {macro.calories} calories
                                    </div>
                                </div>
                                <div className={`text-2xl font-bold ${macro.color}`}>
                                    {macro.percentage}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Targets */}
                {(targets.fiber || targets.sugar) && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {targets.fiber && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="text-center">
                                    <div className="font-bold text-green-700 dark:text-green-300">{targets.fiber}g</div>
                                    <div className="text-xs text-green-600 dark:text-green-400">Fiber Goal</div>
                                </div>
                            </div>
                        )}
                        {targets.sugar && (
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                <div className="text-center">
                                    <div className="font-bold text-orange-700 dark:text-orange-300">{targets.sugar}g</div>
                                    <div className="text-xs text-orange-600 dark:text-orange-400">Sugar Limit</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="mr-2" size={20} />
                    Personalized Tips
                </h3>

                <div className="space-y-3">
                    {recommendations.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800 dark:text-blue-200">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Metabolic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Metabolic Information
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="font-medium text-gray-900 dark:text-white">BMR</div>
                        <div className="text-gray-600 dark:text-gray-400">{Math.round(bmr)} calories</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Calories at rest
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="font-medium text-gray-900 dark:text-white">TDEE</div>
                        <div className="text-gray-600 dark:text-gray-400">{tdee} calories</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Total daily expenditure
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}