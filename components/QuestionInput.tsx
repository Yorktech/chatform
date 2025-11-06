import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuestionInputProps {
  question: Question;
  isBotTyping: boolean;
  onSubmit: (answer: string) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, isBotTyping, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Reset input when question changes
    setInputValue('');
  }, [question]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isBotTyping) return;
    onSubmit(inputValue);
    setInputValue('');
  };

  if (isBotTyping) {
    return (
      <div className="flex items-center justify-center p-4 h-[58px]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting response...</p>
      </div>
    );
  }

  if (!question) return null;

  switch (question.type) {
    case 'select':
      return (
        <div className="flex flex-wrap justify-center gap-3 p-2">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onSubmit(option)}
              disabled={isBotTyping}
              className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {option}
            </button>
          ))}
        </div>
      );

    case 'rating':
      const numbers = Array.from({ length: question.max - question.min + 1 }, (_, i) => i + question.min);
      return (
        <div className="flex flex-wrap justify-center gap-2 p-2">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => onSubmit(num.toString())}
              disabled={isBotTyping}
              className="w-10 h-10 flex items-center justify-center border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {num}
            </button>
          ))}
        </div>
      );

    case 'text':
    default:
      return (
        <form onSubmit={handleTextSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={"Type your answer here..."}
            disabled={isBotTyping}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={isBotTyping || inputValue.trim() === ''}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
            aria-label="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform="rotate(90)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      );
  }
};

export default QuestionInput;
