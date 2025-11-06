
import React from 'react';
import { Answer } from '../types';

interface SummaryViewProps {
  answers: Answer[];
  onRestart: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ answers, onRestart }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Questionnaire Summary</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Here are the responses you provided.</p>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 -mr-4">
          {answers.map((item) => (
            <div key={item.questionId} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Question {item.questionId}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{item.questionText}</p>
              <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg">
                <p className="font-medium text-blue-800 dark:text-blue-300">{item.answerText}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onRestart}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
