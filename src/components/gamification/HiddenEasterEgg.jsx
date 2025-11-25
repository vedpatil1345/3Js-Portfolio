import React, { useState, useEffect } from 'react';
import { useGamification } from './GamificationContext';
import { easterEggs } from './EasterEggPopup';

const HiddenEasterEgg = ({ characterId, pageName }) => {
  const { discoverEasterEgg, openEasterEgg, discoveredEasterEggs } = useGamification();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [side, setSide] = useState('left'); // left, right, top, bottom

  const eggData = easterEggs[characterId];
  const isDiscovered = discoveredEasterEggs.includes(characterId);

  useEffect(() => {
    // Don't show if already discovered
    if (isDiscovered) return;

    // Random appearance interval between 10-30 seconds
    const showInterval = Math.random() * 10000 + 10000;
    
    const showTimer = setTimeout(() => {
      // Randomly choose left or right side only
      const sides = ['left', 'right'];
      const chosenSide = sides[Math.floor(Math.random() * sides.length)];
      setSide(chosenSide);

      // Position based on side (peeking from edges - mostly hidden)
      let x, y;
      const imageSize = 120;
      const peekAmount = 30; // Only 30px visible, rest hidden behind edge
      
      if (chosenSide === 'left') {
        x = -imageSize + peekAmount; // Start off-screen, peek in
        y = Math.random() * (window.innerHeight - imageSize);
      } else if (chosenSide === 'right') {
        x = window.innerWidth - peekAmount; // Most hidden on right
        y = Math.random() * (window.innerHeight - imageSize);
      } else if (chosenSide === 'top') {
        x = Math.random() * (window.innerWidth - imageSize);
        y = -imageSize + peekAmount; // Most hidden on top
      } else { // bottom
        x = Math.random() * (window.innerWidth - imageSize);
        y = window.innerHeight - peekAmount; // Most hidden on bottom
      }
      
      setPosition({ x, y });
      setIsVisible(true);

      // Hide after 5-8 seconds if not clicked
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, Math.random() * 3000 + 5000);

      return () => clearTimeout(hideTimer);
    }, showInterval);

    return () => clearTimeout(showTimer);
  }, [isVisible, isDiscovered, characterId]);

  const handleClick = () => {
    const isNew = discoverEasterEgg(characterId);
    
    if (isNew) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-[400] animate-bounce';
      notification.textContent = '🎉 Easter Egg Caught!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
    
    openEasterEgg(characterId);
    setIsVisible(false);
  };

  if (!isVisible || isDiscovered || !eggData) return null;

  // Animation based on which side
const getAnimation = () => {
    switch(side) {
        case 'left': return 'peek-left 2s ease-in-out infinite';
        case 'right': return 'peek-right 2s ease-in-out infinite';
        default: return '';
    }
};

return (
    <>
        <style>{`
            @keyframes peek-left {
                0%, 100% { transform: translateX(0) rotate(15deg); }
                50% { transform: translateX(20px) rotate(15deg); }
            }
            @keyframes peek-right {
                0%, 100% { transform: translateX(0) rotate(-15deg); }
                50% { transform: translateX(-20px) rotate(-15deg); }
            }
        `}</style>
        
        <button
            onClick={handleClick}
            className="fixed z-[150] cursor-pointer transform transition-all duration-300 hover:scale-110"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                animation: getAnimation()
            }}
            title="Click to catch!"
        >
            <img 
                src={eggData.image} 
                alt={eggData.name}
                className="w-full h-40 object-contain"
                onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext y="60" x="25" font-size="50"%3E❓%3C/text%3E%3C/svg%3E';
          }}
        />
      </button>
    </>
  );
};

export default HiddenEasterEgg;
