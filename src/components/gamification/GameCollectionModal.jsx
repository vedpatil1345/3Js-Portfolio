import React from 'react';
import { X, Gamepad2, Star, Lock } from 'lucide-react';
import { useGamification } from './GamificationContext';
import { easterEggs } from './EasterEggPopup';

const games = [
  { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '⭕', description: 'Classic X and O game' },
  { id: 'snake', name: 'Snake', icon: '🐍', description: 'Eat and grow longer' },
  { id: 'memory', name: 'Memory Match', icon: '🧠', description: 'Find matching pairs' },
  { id: 'flappy', name: 'Flappy Bird', icon: '🐦', description: 'Fly through the pipes' }
];

const GameCollectionModal = ({ onClose, onGameSelect, onEasterEggSelect }) => {
  const { discoveredGames, discoveredEasterEggs } = useGamification();

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-500/50">
        <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-gray-200 dark:border-slate-700 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Secret Collection
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Discover hidden games and Easter eggs throughout the portfolio
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Games Section */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Mini Games ({discoveredGames.length}/{games.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {games.map((game) => {
                const isDiscovered = discoveredGames.includes(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => isDiscovered && onGameSelect(game.id)}
                    disabled={!isDiscovered}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isDiscovered
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 hover:shadow-lg cursor-pointer'
                        : 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{isDiscovered ? game.icon : <Lock className="w-8 h-8" />}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {isDiscovered ? game.name : '???'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isDiscovered ? game.description : 'Not discovered yet'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Easter Eggs Section */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Easter Eggs ({discoveredEasterEggs.length}/{Object.keys(easterEggs).length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.keys(easterEggs).map((eggId) => {
                const isDiscovered = discoveredEasterEggs.includes(eggId);
                const egg = easterEggs[eggId];
                return (
                  <button
                    key={eggId}
                    onClick={() => isDiscovered && onEasterEggSelect(eggId)}
                    disabled={!isDiscovered}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isDiscovered
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 hover:shadow-lg cursor-pointer'
                        : 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="aspect-square bg-gray-200 dark:bg-slate-700 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                      {isDiscovered ? (
                        <img 
                          src={egg.image} 
                          alt={egg.name}
                          className="w-full h-32 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="hidden w-full h-full items-center justify-center text-3xl">
                        🦸
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-center text-gray-900 dark:text-white truncate">
                      {isDiscovered ? egg.name : '???'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default GameCollectionModal;
