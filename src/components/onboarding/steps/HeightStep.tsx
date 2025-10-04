import React, { useState, useEffect, useRef } from 'react';
import { OnboardingStep } from '../OnboardingStep';

interface HeightStepProps {
  value: number;
  onChange: (height: number) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function HeightStep({ value, onChange, onNext, onBack }: HeightStepProps) {
  const [height, setHeight] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNext = () => {
    const heightValue = parseInt(height);
    if (heightValue >= 100 && heightValue <= 250) {
      onChange(heightValue);
      onNext();
    }
  };

  const isValid = height && parseInt(height) >= 100 && parseInt(height) <= 250;

  return (
    <OnboardingStep
      title="What's your height?"
      subtitle="We'll use this to calculate your fitness metrics"
      onNext={handleNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && isValid && handleNext()}
            placeholder="175"
            className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200 font-medium">
            cm
          </span>
        </div>
        
        <p className="text-purple-200 text-sm text-center">
          Enter your height in centimeters (100-250 cm)
        </p>
      </div>
    </OnboardingStep>
  );
}