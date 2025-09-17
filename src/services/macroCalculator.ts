import { User, MacroTargets } from '../types';

// Activity multipliers for BMR calculation
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Goal adjustments (percentage of maintenance calories)
const GOAL_ADJUSTMENTS = {
  lose_weight: 0.8, // 20% deficit
  gain_weight: 1.2, // 20% surplus
  maintain: 1.0, // maintenance
  build_muscle: 1.15, // 15% surplus
};

// Macro distribution percentages based on goals
const MACRO_DISTRIBUTIONS = {
  lose_weight: { protein: 0.35, carbs: 0.35, fat: 0.30 },
  gain_weight: { protein: 0.25, carbs: 0.45, fat: 0.30 },
  maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
  build_muscle: { protein: 0.35, carbs: 0.40, fat: 0.25 },
};

export class MacroCalculator {
  /**
   * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
   */
  static calculateBMR(user: User): number {
    const { weight, height, age, gender } = user;
    
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  /**
   * Calculate Total Daily Energy Expenditure
   */
  static calculateTDEE(user: User): number {
    const bmr = this.calculateBMR(user);
    const activityMultiplier = ACTIVITY_MULTIPLIERS[user.activityLevel];
    return Math.round(bmr * activityMultiplier);
  }

  /**
   * Calculate daily macro targets based on user goals
   */
  static calculateMacroTargets(user: User): MacroTargets {
    const tdee = this.calculateTDEE(user);
    const goalAdjustment = GOAL_ADJUSTMENTS[user.goal];
    const targetCalories = Math.round(tdee * goalAdjustment);
    
    const distribution = MACRO_DISTRIBUTIONS[user.goal];
    
    // Calculate macros in grams
    const proteinCalories = targetCalories * distribution.protein;
    const carbCalories = targetCalories * distribution.carbs;
    const fatCalories = targetCalories * distribution.fat;
    
    const protein = Math.round(proteinCalories / 4); // 4 calories per gram
    const carbs = Math.round(carbCalories / 4); // 4 calories per gram
    const fat = Math.round(fatCalories / 9); // 9 calories per gram
    
    // Calculate fiber target (14g per 1000 calories)
    const fiber = Math.round((targetCalories / 1000) * 14);
    
    // Calculate sugar limit (10% of total calories)
    const sugar = Math.round((targetCalories * 0.1) / 4);

    return {
      calories: targetCalories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
    };
  }

  /**
   * Get macro targets with goal-specific recommendations
   */
  static getMacroRecommendations(user: User): {
    targets: MacroTargets;
    recommendations: string[];
  } {
    const targets = this.calculateMacroTargets(user);
    const recommendations: string[] = [];

    switch (user.goal) {
      case 'lose_weight':
        recommendations.push(
          'Focus on high protein to preserve muscle mass',
          'Prioritize fiber-rich foods for satiety',
          'Stay hydrated and eat plenty of vegetables'
        );
        break;
      case 'gain_weight':
        recommendations.push(
          'Eat frequent, nutrient-dense meals',
          'Include healthy fats like nuts and avocados',
          'Don\'t skip post-workout nutrition'
        );
        break;
      case 'maintain':
        recommendations.push(
          'Balance your macros throughout the day',
          'Listen to your hunger cues',
          'Focus on whole, unprocessed foods'
        );
        break;
      case 'build_muscle':
        recommendations.push(
          'Eat protein with every meal',
          'Time carbs around your workouts',
          'Don\'t neglect healthy fats for hormone production'
        );
        break;
    }

    return { targets, recommendations };
  }
}