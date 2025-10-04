import React, { useState, useEffect, useRef } from 'react';
import { OnboardingStep } from '../OnboardingStep';

interface WeightStepProps {
  value: number;
  onChange: (weight: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function WeightStep({ value, onChange, onNext, onBack }: WeightStepProps) {
  const [weight, setWeight] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNext = () => {
    const weightValue = parseInt(weight);
    if (weightValue >= 30 && weightValue <= 300) {
      onChange(weightValue);
      onNext();
    }
  };

  const isValid = weight && parseInt(weight) >= 30 && parseInt(weight) <= 300;

  return (
    <OnboardingStep
      title="What's your weight?"
      subtitle="This helps us track your progress"
      onNext={handleNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && isValid && handleNext()}
            placeholder="70"
            className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200 font-medium">
            kg
          </span>
        </div>
        
        <p className="text-purple-200 text-sm text-center">
          Enter your current weight in kilograms (30-300 kg)
        </p>
      </div>
    </OnboardingStep>
  );
}