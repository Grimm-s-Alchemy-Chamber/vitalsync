import React from 'react';
import { Armchair, Coffee, Car, Bike, Zap } from 'lucide-react';
import { OnboardingStep } from '../OnboardingStep';
import { User } from '../../../types';

interface ActivityStepProps {
  value: User['activityLevel'];
  onChange: (activityLevel: User['activityLevel']) => void;
  onNext: () => void;
  onBack: () => void;
}

const activityOptions = [
  { 
    value: 'sedentary' as const, 
    label: 'Sedentary', 
    description: 'Little to no exercise',
    icon: Armchair, 
    color: 'text-gray-400' 
  },
  { 
    value: 'light' as const, 
    label: 'Light Activity', 
    description: 'Light exercise 1-3 days/week',
    icon: Coffee, 
    color: 'text-yellow-400' 
  },
  { 
    value: 'moderate' as const, 
    label: 'Moderate', 
    description: 'Moderate exercise 3-5 days/week',
    icon: Car, 
    color: 'text-blue-400' 
  },
  { 
    value: 'active' as const, 
    label: 'Active', 
    description: 'Hard exercise 6-7 days/week',
    icon: Bike, 
    color: 'text-green-400' 
  },
  { 
    value: 'very_active' as const, 
    label: 'Very Active', 
    description: 'Physical job + exercise',
    icon: Zap, 
    color: 'text-red-400' 
  },
];

export function ActivityStep({ value, onChange, onNext, onBack }: ActivityStepProps) {
  const handleSelect = (activityLevel: User['activityLevel']) => {
    onChange(activityLevel);
    setTimeout(onNext, 200);
  };

  return (
    <OnboardingStep
      title="Activity Level"
      subtitle="How active are you typically?"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      isLast={true}
    >
      <div className="space-y-3">
        {activityOptions.map(({ value: optionValue, label, description, icon: Icon, color }) => (
          <button
            key={optionValue}
            onClick={() => handleSelect(optionValue)}
            className={`w-full flex items-start space-x-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              value === optionValue
                ? 'bg-white/30 border-white text-white'
                : 'bg-white/10 border-white/30 text-purple-200 hover:bg-white/20 hover:border-white/50'
            }`}
          >
            <Icon size={24} className={value === optionValue ? 'text-white mt-1' : `${color} mt-1`} />
            <div>
              <div className="font-medium text-lg">{label}</div>
              <div className="text-sm opacity-80">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </OnboardingStep>
  );
}