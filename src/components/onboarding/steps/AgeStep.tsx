import React, { useState, useEffect, useRef } from 'react';
import { OnboardingStep } from '../OnboardingStep';

interface AgeStepProps {
  value: number;
  onChange: (age: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AgeStep({ value, onChange, onNext, onBack }: AgeStepProps) {
  const [age, setAge] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNext = () => {
    const ageValue = parseInt(age);
    if (ageValue >= 13 && ageValue <= 120) {
      onChange(ageValue);
      onNext();
    }
  };

  const isValid = age && parseInt(age) >= 13 && parseInt(age) <= 120;

  return (
    <OnboardingStep
      title="What's your age?"
      subtitle="We'll personalize your fitness recommendations"
      onNext={handleNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && isValid && handleNext()}
          placeholder="25"
          className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-center"
        />
        
        <p className="text-purple-200 text-sm text-center">
          Enter your age (13-120 years)
        </p>
      </div>
    </OnboardingStep>
  );
}