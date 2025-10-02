import React, { useState, useEffect } from 'react';
import { Brain, X, CheckCircle } from 'lucide-react';
import { PreferenceLearnedEvent } from '../../types/preferences';

interface PreferenceLearningIndicatorProps {
  learnedPreferences: PreferenceLearnedEvent[];
  onDismiss: () => void;
}

export function PreferenceLearningIndicator({ learnedPreferences, onDismiss }: PreferenceLearningIndicatorProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (learnedPreferences.length > 0) {
      setVisible(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation to complete
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [learnedPreferences, onDismiss]);

  if (!visible || learnedPreferences.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 text-white shadow-2xl border border-white/20 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Brain size={16} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={16} className="text-green-300" />
              <h3 className="font-semibold text-sm">Preferences Learned!</h3>
            </div>
            
            <div className="space-y-1">
              {learnedPreferences.map((preference, index) => (
                <p key={preference.id} className="text-purple-100 text-sm">
                  {preference.message}
                </p>
              ))}
            </div>
            
            <p className="text-purple-200 text-xs mt-2">
              Your AI assistant will remember these preferences for future conversations
            </p>
          </div>
          
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}