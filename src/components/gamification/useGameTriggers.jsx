import { useEffect } from 'react';
import { useGamification } from './GamificationContext';

export const useSecretCode = (code, callback) => {
  useEffect(() => {
    let input = '';
    const handler = (e) => {
      input += e.key.toLowerCase();
      if (input.length > code.length) {
        input = input.slice(-code.length);
      }
      if (input === code.toLowerCase()) {
        callback();
        input = '';
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, callback]);
};

export const useHiddenTrigger = (elementRef, gameOrEggId, type = 'game') => {
  const { discoverGame, discoverEasterEgg, openGame, openEasterEgg } = useGamification();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handler = () => {
      const isNew = type === 'game' ? discoverGame(gameOrEggId) : discoverEasterEgg(gameOrEggId);
      
      if (isNew) {
        // Show discovery notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[400] animate-in slide-in-from-right duration-300';
        notification.textContent = type === 'game' ? `New game discovered: ${gameOrEggId}!` : `Easter egg found!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('animate-out', 'fade-out');
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      }

      // Open the game or easter egg
      if (type === 'game') {
        openGame(gameOrEggId);
      } else {
        openEasterEgg(gameOrEggId);
      }
    };

    element.addEventListener('dblclick', handler);
    return () => element.removeEventListener('dblclick', handler);
  }, [elementRef, gameOrEggId, type, discoverGame, discoverEasterEgg, openGame, openEasterEgg]);
};
