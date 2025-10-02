import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { ChatMessage } from '../../types';
import { PreferenceLearnedEvent } from '../../types/preferences';
import { ChatMessageItem } from './ChatMessageItem';
import { PreferenceLearningIndicator } from './PreferenceLearningIndicator';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<{ learnedPreferences?: PreferenceLearnedEvent[] }>;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading = false }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [learnedPreferences, setLearnedPreferences] = useState<PreferenceLearnedEvent[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = message.trim();
      setMessage('');
      
      try {
        const result = await onSendMessage(userMessage);
        
        // Show learned preferences if any
        if (result.learnedPreferences && result.learnedPreferences.length > 0) {
          setLearnedPreferences(result.learnedPreferences);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    // Mock voice recognition toggle
    setIsListening(!isListening);
    // In a real app, you'd implement Web Speech API here
  };

  const dismissLearnedPreferences = () => {
    setLearnedPreferences([]);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Preference Learning Indicator */}
      <PreferenceLearningIndicator
        learnedPreferences={learnedPreferences}
        onDismiss={dismissLearnedPreferences}
      />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                👋 Hi there! I'm your AI fitness assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                I can help you log meals, track workouts, and answer fitness questions. 
                I'll also learn your preferences as we chat!
              </p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 text-xs text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">💡 Try saying things like:</p>
                <ul className="text-left space-y-1">
                  <li>• "I always eat Milky Mist paneer"</li>
                  <li>• "I'm allergic to gluten"</li>
                  <li>• "I love doing pull-ups"</li>
                  <li>• "I prefer 45-minute workouts"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessageItem key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me about your meal, workout, or preferences..."
              className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={toggleListening}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                isListening 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`p-3 rounded-2xl transition-all duration-200 ${
              message.trim() && !isLoading
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}