import React from 'react';
import { TrendingDown, TrendingUp, Target, Zap } from 'lucide-react';
import { OnboardingStep } from '../OnboardingStep';
import { User } from '../../../types';

interface GoalStepProps {
  value: User['goal'];
  onChange: (goal: User['goal']) => void;
  onNext: () => void;
  onBack: () => void;
}

const goalOptions = [
  { value: 'lose_weight' as const, label: 'Lose Weight', icon: TrendingDown, color: 'text-red-400' },
  { value: 'gain_weight' as const, label: 'Gain Weight', icon: TrendingUp, color: 'text-green-400' },
  { value: 'maintain' as const, label: 'Maintain Weight', icon: Target, color: 'text-blue-400' },
  { value: 'build_muscle' as const, label: 'Build Muscle', icon: Zap, color: 'text-yellow-400' },
];

export function GoalStep({ value, onChange, onNext, onBack }: GoalStepProps) {
  const handleSelect = (goal: User['goal']) => {
    onChange(goal);
    setTimeout(onNext, 200);
  };

  return (
    <OnboardingStep
      title="What's your goal?"
      subtitle="We'll customize your experience based on this"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
    >
      <div className="space-y-3">
        {goalOptions.map(({ value: optionValue, label, icon: Icon, color }) => (
          <button
            key={optionValue}
            onClick={() => handleSelect(optionValue)}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
              value === optionValue
                ? 'bg-white/30 border-white text-white'
                : 'bg-white/10 border-white/30 text-purple-200 hover:bg-white/20 hover:border-white/50'
            }`}
          >
            <Icon size={24} className={value === optionValue ? 'text-white' : color} />
            <span className="font-medium text-lg">{label}</span>
          </button>
        ))}
      </div>
    </OnboardingStep>
  );
}