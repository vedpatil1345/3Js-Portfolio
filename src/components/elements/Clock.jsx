import React, { useState, useEffect, useCallback, memo } from "react";

// Optimized NumberDisplay with explicit prop types and avoiding unnecessary calculations
const NumberDisplay = memo(({ value, opacity, bg, size, shape, position, isCenter }) => {
  const { left, top } = position;
  
  return (
    <div
      className={`absolute flex items-center justify-center ${size} ${shape} ${bg} ${
        isCenter ? "border-4 border-gray-400 shadow-lg" : "border-2 border-gray-300"
      } transition-opacity duration-300`}
      style={{
        left,
        top,
        opacity,
      }}
    >
      <span className={`${isCenter ? "text-3xl" : "text-2xl"} font-bold dark:text-white text-black`}>
        {value}
      </span>
    </div>
  );
});

// Pre-calculate static values outside component
const baseNumbers = [6, 7, 8, 9, 0, 1, 2];
const opacities = [0.2, 0.4, 0.7, 1, 0.7, 0.4, 0.2];
const backgroundColors = [
  "dark:bg-emerald-600 bg-emerald-400",
  "dark:bg-amber-600 bg-amber-300",
  "dark:bg-blue-700 bg-blue-300",
  "dark:bg-gray-800 bg-white",
  "dark:bg-blue-700 bg-blue-300",
  "dark:bg-amber-600 bg-amber-300",
  "dark:bg-emerald-600 bg-emerald-400"
];

// Pre-calculate positions and other styles
const getPositionStyles = (() => {
  const radius = 240;
  const positions = [];
  
  for (let i = 0; i < 7; i++) {
    const isCenter = i === 3;
    const angle = -45 + i * 15;
    
    // Calculate position on the arc
    const xPos = Math.sin(angle * (Math.PI / 180)) * radius;
    const yPos = -Math.cos(angle * (Math.PI / 170)) * radius + radius * 0.8;
    
    const size = isCenter ? "w-14 h-22" : "w-12 h-12";
    const shape = isCenter ? "rounded-4xl" : "rounded-full";
    
    const position = {
      left: `calc(50% + ${xPos}px - ${isCenter ? "32px" : "24px"})`,
      top: `calc(${!isCenter * 24}px + ${yPos}px)`
    };
    
    positions.push({
      size,
      shape,
      position,
      isCenter
    });
  }
  
  return positions;
})();

const Clock = () => {
  // Remove unused state
  const [offset, setOffset] = useState(0);
  
  // Simplified updateNumbers function
  const updateNumbers = useCallback(() => {
    setOffset(prev => (prev + 1) % 10);
  }, []);

  useEffect(() => {
    const timer = setInterval(updateNumbers, 1000);
    return () => clearInterval(timer);
  }, [updateNumbers]);

  // Calculate current numbers based on offset
  const currentNumbers = baseNumbers.map(num => (num - offset + 10) % 10);

  return (
    <div className="flex items-center justify-center w-full bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 rounded-lg shadow-xl mt-3">
      <div className="relative w-full max-w-2xl h-60">
        {currentNumbers.map((value, index) => (
          <NumberDisplay
            key={`number-${index}`}
            value={value}
            opacity={opacities[index]}
            bg={backgroundColors[index]}
            size={getPositionStyles[index].size}
            shape={getPositionStyles[index].shape}
            position={getPositionStyles[index].position}
            isCenter={getPositionStyles[index].isCenter}
          />
        ))}
        
        {/* Arc line decoration */}
        <div className="absolute w-5/6 h-3/4 border-t-2 border-gray-300 dark:border-gray-600 rounded-t-full" 
             style={{ left: '8%', top: '30%' }}>
        </div>
        
        {/* Center dot */}
        <div className="absolute w-4 h-4 bg-red-500 rounded-full"
             style={{ left: 'calc(50% - 8px)', top: 'calc(50% + 30px)' }}>
        </div>
      </div>
    </div>
  );
};

export default memo(Clock);