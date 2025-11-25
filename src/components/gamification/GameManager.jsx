import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useGamification } from './GamificationContext';
import TicTacToe from './TicTacToe';
import SnakeGame from './SnakeGame';
import MemoryGame from './MemoryGame';
import FlappyGame from './FlappyGame';
import EasterEggPopup from './EasterEggPopup';
import GameCollectionModal from './GameCollectionModal';

const GameManager = () => {
  const { activeGame, activeEasterEgg, closeGame, closeEasterEgg, discoveredGames, discoveredEasterEggs, openGame, openEasterEgg } = useGamification();
  const [showCollection, setShowCollection] = useState(false);

  const hasDiscoveries = discoveredGames.length > 0 || discoveredEasterEggs.length > 0;

  return (
    <>
      {/* Floating Collection Button */}
      {hasDiscoveries && (
        <button
          onClick={() => setShowCollection(true)}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-[200] p-4 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 group"
          title="View Collection"
        >
          <Gamepad2 className="w-6 h-6" />
          {(discoveredGames.length > 0 || discoveredEasterEggs.length > 0) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {discoveredGames.length + discoveredEasterEggs.length}
            </span>
          )}
        </button>
      )}

      {/* Active Games */}
      {activeGame === 'tictactoe' && <TicTacToe onClose={closeGame} />}
      {activeGame === 'snake' && <SnakeGame onClose={closeGame} />}
      {activeGame === 'memory' && <MemoryGame onClose={closeGame} />}
      {activeGame === 'flappy' && <FlappyGame onClose={closeGame} />}

      {/* Active Easter Egg */}
      {activeEasterEgg && <EasterEggPopup eggId={activeEasterEgg} onClose={closeEasterEgg} />}

      {/* Collection Modal */}
      {showCollection && (
        <GameCollectionModal
          onClose={() => setShowCollection(false)}
          onGameSelect={(gameId) => {
            setShowCollection(false);
            openGame(gameId);
          }}
          onEasterEggSelect={(eggId) => {
            setShowCollection(false);
            openEasterEgg(eggId);
          }}
        />
      )}
    </>
  );
};

export default GameManager;
