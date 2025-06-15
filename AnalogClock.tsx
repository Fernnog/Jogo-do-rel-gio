import React from 'react';

interface AnalogClockProps {
  hour: number; // 1-12
  minute: number; // 0-59 (though only 0 will be used for "o'clock")
}

const AnalogClock: React.FC<AnalogClockProps> = ({ hour, minute }) => {
  // For o'clock, minute hand angle is 0 (points to 12)
  // Hour hand angle: (hour % 12 + minute / 60) / 12 * 360.
  // Since minute is always 0 for o'clock:
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60 / 12) * 360; // minute part will be 0
  const minuteAngle = (minute / 60) * 360;

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const R_text = 38; // Radius for numbers

  return (
    <div className="w-60 h-60 sm:w-72 sm:h-72">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Clock Face */}
        <circle cx="50" cy="50" r="48" fill="#FFFBEB" stroke="#FDBA74" strokeWidth="3" /> {/* cream-100, orange-300 */}
        
        {/* Hour Markings */}
        {numbers.map((num) => {
          const angleRad = (num / 12) * 2 * Math.PI - Math.PI / 2; // Offset for 12 at top
          const x1 = 50 + 42 * Math.cos(angleRad);
          const y1 = 50 + 42 * Math.sin(angleRad);
          const x2 = 50 + 46 * Math.cos(angleRad);
          const y2 = 50 + 46 * Math.sin(angleRad);
          const isMajor = num % 3 === 0;
          return (
            <line 
              key={`mark-${num}`}
              x1={x1} y1={y1} x2={x2} y2={y2} 
              stroke={isMajor ? "#F97316" : "#FDBA74"} // orange-500, orange-300
              strokeWidth={isMajor ? "1.5" : "1"}
            />
          );
        })}

        {/* Numbers */}
        {numbers.map((num) => {
          const angle_for_pos_deg = num * 30;
          const x = 50 + R_text * Math.sin(angle_for_pos_deg * Math.PI / 180);
          const y = 50 - R_text * Math.cos(angle_for_pos_deg * Math.PI / 180);
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central" // Changed from 'middle' for better vertical centering in some fonts
              fontSize="8"
              fill="#D97706" // amber-600
              fontWeight="bold"
              fontFamily="'Comic Neue', cursive"
            >
              {num}
            </text>
          );
        })}

        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="28" // Length of hour hand
          stroke="#4B5563" // gray-600
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 50 50)`}
        />

        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="18" // Length of minute hand
          stroke="#4B5563" // gray-600
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 50 50)`}
        />

        {/* Center Dot */}
        <circle cx="50" cy="50" r="3" fill="#374151" /> {/* gray-700 */}
      </svg>
    </div>
  );
};

export default React.memo(AnalogClock);
