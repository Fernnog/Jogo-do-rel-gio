import React from 'react';
import { HOUR_NAMES } from '../constants';

interface OptionButtonProps {
  hour: number;
  onClick: (hour: number) => void;
  disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ hour, onClick, disabled }) => {
  const hourName = HOUR_NAMES[hour] || 'Unknown';
  const capitalizedHourName = hourName.charAt(0).toUpperCase() + hourName.slice(1);

  return (
    <button
      onClick={() => onClick(hour)}
      disabled={disabled}
      className={`
        w-full sm:w-auto flex-grow sm:flex-grow-0
        bg-sky-500 hover:bg-sky-600 active:bg-sky-700
        text-white font-semibold py-3 px-4 sm:px-5 rounded-lg shadow-md hover:shadow-lg
        transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-75
        text-base sm:text-md
        disabled:bg-slate-300 disabled:hover:bg-slate-300 disabled:shadow-md disabled:cursor-not-allowed disabled:scale-100
        m-1 sm:m-0 
      `}
      aria-label={`Select ${capitalizedHourName} o'clock`}
    >
      {capitalizedHourName} o'clock
    </button>
  );
};

export default React.memo(OptionButton);