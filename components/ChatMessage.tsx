
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  const botAvatar = (
    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
  );

  const userAvatar = (
    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center ml-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );

  return (
    <div className={`flex items-end ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && botAvatar}
      <div
        className={`px-4 py-3 rounded-2xl max-w-md md:max-w-lg shadow-md ${
          isBot
            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      {!isBot && userAvatar}
    </div>
  );
};

export default ChatMessage;
