import React from 'react';
import { User, Users } from 'lucide-react';
import { OnboardingStep } from '../OnboardingStep';
import { User as UserType } from '../../../types';

interface GenderStepProps {
  value: UserType['gender'];
  onChange: (gender: UserType['gender']) => void;
  onNext: () => void;
  onBack: () => void;
}

const genderOptions = [
  { value: 'male' as const, label: 'Male', icon: User },
  { value: 'female' as const, label: 'Female', icon: User },
  { value: 'other' as const, label: 'Other', icon: Users },
];

export function GenderStep({ value, onChange, onNext, onBack }: GenderStepProps) {
  const handleSelect = (gender: UserType['gender']) => {
    onChange(gender);
    setTimeout(onNext, 200); // Small delay for better UX
  };

  return (
    <OnboardingStep
      title="What's your gender?"
      subtitle="This helps us provide better recommendations"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
    >
      <div className="space-y-3">
        {genderOptions.map(({ value: optionValue, label, icon: Icon }) => (
          <button
            key={optionValue}
            onClick={() => handleSelect(optionValue)}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
              value === optionValue
                ? 'bg-white/30 border-white text-white'
                : 'bg-white/10 border-white/30 text-purple-200 hover:bg-white/20 hover:border-white/50'
            }`}
          >
            <Icon size={24} />
            <span className="font-medium text-lg">{label}</span>
          </button>
        ))}
      </div>
    </OnboardingStep>
  );
}