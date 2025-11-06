import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Answer, Question } from './types';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import SummaryView from './components/SummaryView';
import QuestionInput from './components/QuestionInput';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [botResponses, setBotResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsResponse, responsesResponse] = await Promise.all([
          fetch('./questions.json'),
          fetch('./responses.json')
        ]);

        if (!questionsResponse.ok) {
          throw new Error(`Failed to load questions: ${questionsResponse.statusText}`);
        }
        if (!responsesResponse.ok) {
          throw new Error(`Failed to load responses: ${responsesResponse.statusText}`);
        }

        const questionsData: Question[] = await questionsResponse.json();
        const responsesData: string[] = await responsesResponse.json();

        if (!questionsData || questionsData.length === 0) {
          throw new Error("Questionnaire data is empty or invalid.");
        }
        if (!responsesData || responsesData.length === 0) {
            throw new Error("Bot responses data is empty or invalid.");
        }
        
        setQuestions(questionsData);
        setBotResponses(responsesData);
      } catch (e) {
        console.error("Failed to fetch questionnaire data:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(`Failed to load questionnaire: ${errorMessage}. Please try refreshing the page.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender }]);
  };

  const startQuestionnaire = useCallback(() => {
    if (questions.length === 0) return;

    setMessages([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setIsBotTyping(true);
    setTimeout(() => {
      addMessage(questions[0].text, 'bot');
      setIsBotTyping(false);
    }, 1000);
  }, [questions]);

  useEffect(() => {
    if (!isLoading && questions.length > 0 && !error) {
      startQuestionnaire();
    }
  }, [isLoading, questions, error, startQuestionnaire]);

  const processAnswer = (answerText: string) => {
    if (answerText.trim() === '' || isBotTyping || isCompleted || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    addMessage(answerText, 'user');
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerText: answerText,
    }]);
    setIsBotTyping(true);

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    if (nextIndex < questions.length) {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      setTimeout(() => {
        addMessage(randomResponse, 'bot');
      }, 1000);

      setTimeout(() => {
        addMessage(questions[nextIndex].text, 'bot');
        setIsBotTyping(false);
      }, 2500);
    } else {
      setTimeout(() => {
        addMessage("Thank you. All questions have been completed. Generating summary...", 'bot');
      }, 1000);
      setTimeout(() => {
        setIsCompleted(true);
        setIsBotTyping(false); 
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Loading Questionnaire...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-md text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold text-red-600 dark:text-red-400">Error</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return <SummaryView answers={answers} onRestart={startQuestionnaire} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
      <header className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center">Structured Questionnaire</h1>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isBotTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {!isCompleted && questions.length > 0 && currentQuestionIndex < questions.length && (
          <QuestionInput
            question={questions[currentQuestionIndex]}
            isBotTyping={isBotTyping}
            onSubmit={processAnswer}
          />
        )}
      </footer>
    </div>
  );
};

export default App;
