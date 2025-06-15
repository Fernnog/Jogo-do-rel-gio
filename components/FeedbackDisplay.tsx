import React from 'react';

interface FeedbackDisplayProps {
  message: string;
  isCorrect: boolean | null;
  isVisible: boolean;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, isCorrect, isVisible }) => {
  if (!isVisible || !message) {
    return <div className="h-12 mt-4" role="alert"></div>; // Keep space consistent
  }

  const baseClasses = "mt-4 p-3 rounded-lg text-center font-semibold text-lg shadow transition-opacity duration-300 ease-in-out";
  let textColor = 'text-gray-700';
  let bgColor = 'bg-gray-100'; // Default background

  if (isCorrect === true) {
    textColor = 'text-green-700';
    bgColor = 'bg-green-100';
  } else if (isCorrect === false) {
    textColor = 'text-red-700';
    bgColor = 'bg-red-100';
  }

  return (
    <div
      className={`${baseClasses} ${textColor} ${bgColor} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default React.memo(FeedbackDisplay);