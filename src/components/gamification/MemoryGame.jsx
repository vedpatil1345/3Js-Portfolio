import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';

const MemoryGame = ({ onClose }) => {
  const symbols = [
    { name: 'React', icon: '/assets/react.svg' },
    { name: 'Node.js', icon: '/assets/nodejs.svg' },
    { name: 'Python', icon: '/assets/python.svg' },
    { name: 'JavaScript', icon: '/assets/javascript.svg' },
    { name: 'MongoDB', icon: '/assets/mongodb.svg' },
    { name: 'Next.js', icon: '/assets/nextjs.svg' },
    { name: 'Firebase', icon: '/assets/firebase.svg' },
    { name: 'Express', icon: '/assets/express.svg' }
  ];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, ...symbol }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].name === cards[second].name) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-hidden">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-lg w-full mx-4 border-2 border-purple-500/50 max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Memory Match
        </h2>

        <div className="text-center mb-3 sm:mb-4">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            Moves: <span className="font-bold text-purple-600 dark:text-purple-400">{moves}</span>
          </p>
          {gameWon && (
            <p className="text-green-600 dark:text-green-400 font-bold mt-2">
              You Won in {moves} moves!
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square flex items-center justify-center p-2 sm:p-3 rounded-lg transition-all transform ${
                flipped.includes(index) || matched.includes(index)
                  ? 'bg-purple-500 dark:bg-purple-600 scale-105'
                  : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
              disabled={flipped.includes(index) || matched.includes(index)}
            >
              {flipped.includes(index) || matched.includes(index) ? (
                <img 
                  src={card.icon} 
                  alt={card.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-500 dark:text-gray-400">?</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={initializeGame}
          className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;
