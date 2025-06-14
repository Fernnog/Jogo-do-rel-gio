import React, { useState, useEffect, useCallback } from 'react';
import AnalogClock from './components/AnalogClock';
import OptionButton from './components/OptionButton';
import FeedbackDisplay from './components/FeedbackDisplay';
import { HOUR_NAMES } from './constants';

// Simple SVG icon for refresh
// Changed prop typing to avoid React.FC<...> which might confuse some parsers
const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

// Utility function for shuffling an array
// Changed to a standard function declaration for potentially more robust generic parsing
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [currentHour, setCurrentHour] = useState<number>(1);
  const [options, setOptions] = useState<number[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPendingFeedback, setIsPendingFeedback] = useState<boolean>(false);

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getRandomHour = useCallback((): number => {
    return Math.floor(Math.random() * 12) + 1;
  }, []);

  const generateOptions = useCallback((correctHour: number, numOptions: number = 3): number[] => {
    const allPossibleHours = Object.keys(HOUR_NAMES).map(Number);
    let incorrectOptions: number[] = [];
    
    const availableIncorrectHours = allPossibleHours.filter(h => h !== correctHour);
    const shuffledIncorrect = shuffleArray(availableIncorrectHours);

    for (let i = 0; i < numOptions - 1 && i < shuffledIncorrect.length; i++) {
      incorrectOptions.push(shuffledIncorrect[i]);
    }
    
    const finalOptions = shuffleArray([correctHour, ...incorrectOptions]);
    return finalOptions;
  }, []); // HOUR_NAMES and shuffleArray are stable and from outer scope


  const loadNextQuestion = useCallback(() => {
    setShowFeedback(false);
    setFeedbackMessage('');
    setIsCorrect(null);
    setIsPendingFeedback(false);

    const newHour = getRandomHour();
    setCurrentHour(newHour);
    setOptions(generateOptions(newHour, 3));
    // Removed misplaced eslint-disable-next-line react-hooks/exhaustive-deps comment
  }, [getRandomHour, generateOptions, setCurrentHour, setOptions, setShowFeedback, setFeedbackMessage, setIsCorrect, setIsPendingFeedback]); // Added setters to dep array if they modify state used by this

  useEffect(() => {
    if (isClient) {
      loadNextQuestion();
    }
  }, [isClient, loadNextQuestion]);


  const handleOptionSelect = (selectedHour: number) => {
    if (isPendingFeedback) return;

    setShowFeedback(true);
    const selectedHourName = (HOUR_NAMES[selectedHour] || 'unknown').charAt(0).toUpperCase() + (HOUR_NAMES[selectedHour] || 'unknown').slice(1);
    const correctHourName = (HOUR_NAMES[currentHour] || 'unknown').charAt(0).toUpperCase() + (HOUR_NAMES[currentHour] || 'unknown').slice(1);


    if (selectedHour === currentHour) {
      setFeedbackMessage(`Correct! It's ${correctHourName} o'clock! 🎉`);
      setIsCorrect(true);
      setIsPendingFeedback(true);
      setTimeout(() => {
        loadNextQuestion();
      }, 2500);
    } else {
      setFeedbackMessage(`Not quite. That's ${selectedHourName} o'clock. Try again! 🤔`);
      setIsCorrect(false);
    }
  };
  
  if (!isClient) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-sky-100 to-teal-100 flex flex-col items-center justify-center p-4 selection:bg-pink-300 selection:text-pink-900">
      <main className="bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-pink-500 mb-6 sm:mb-8 tracking-tight">
          What time is it?
        </h1>
        <div className="flex justify-center mb-6 sm:mb-8">
          <AnalogClock hour={currentHour} minute={0} />
        </div>

        <div className="mt-6 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
          {options.map((hourOption) => (
            <OptionButton
              key={hourOption}
              hour={hourOption}
              onClick={handleOptionSelect}
              disabled={isPendingFeedback}
            />
          ))}
        </div>

        <FeedbackDisplay
          message={feedbackMessage}
          isCorrect={isCorrect}
          isVisible={showFeedback}
        />

        <div className="mt-8 sm:mt-10 text-center">
          <button
            onClick={loadNextQuestion}
            disabled={isPendingFeedback}
            className="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75 text-md sm:text-lg inline-flex items-center space-x-2 disabled:bg-slate-400 disabled:hover:bg-slate-400 disabled:cursor-not-allowed"
            aria-label="Get a new clock time"
          >
            <RefreshIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Next Time</span>
          </button>
        </div>
      </main>
      <footer className="mt-8 text-center text-gray-700 text-sm">
        <p>&copy; {new Date().getFullYear()} Fun Clock Learning. Sparking curiosity, one tick at a time!</p>
      </footer>
    </div>
  );
};

export default App;