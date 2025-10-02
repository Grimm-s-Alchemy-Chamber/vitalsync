import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isAI = message.sender === 'ai';
  const timeStr = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex items-start space-x-2 max-w-xs md:max-w-sm ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAI 
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
        }`}>
          {isAI ? <Bot size={16} /> : <User size={16} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
          <div className={`px-4 py-2 rounded-2xl ${
            isAI 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md' 
              : 'bg-purple-600 text-white rounded-br-md'
          }`}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
            {timeStr}
          </span>
        </div>
      </div>
    </div>
  );
}