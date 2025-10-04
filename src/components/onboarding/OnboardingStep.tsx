import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  isLast?: boolean;
}

export function OnboardingStep({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel = 'Continue',
  isLast = false,
}: OnboardingStepProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          {subtitle && (
            <p className="text-purple-200 text-lg">{subtitle}</p>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {children}
        </div>

        <div className="flex justify-between mt-6">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              nextDisabled
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                : 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
            }`}
          >
            <span>{isLast ? 'Get Started' : nextLabel}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}