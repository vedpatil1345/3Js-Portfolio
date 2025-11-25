import React, { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, Play, Pause } from 'lucide-react';

const SnakeGame = ({ onClose }) => {
  const GRID_SIZE = 15;
  const INITIAL_SNAKE = [[7, 7]];
  const INITIAL_DIRECTION = { x: 1, y: 0 };
  const GAME_SPEED = 150;

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
    } while (snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood([5, 5]);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = [head[0] + direction.x, head[1] + direction.y];

      // Check wall collision
      if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  // Touch controls for swipe
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || gameOver) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && direction.x === 0) {
          setDirection({ x: 1, y: 0 }); // Right
        } else if (deltaX < 0 && direction.x === 0) {
          setDirection({ x: -1, y: 0 }); // Left
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && direction.y === 0) {
          setDirection({ x: 0, y: 1 }); // Down
        } else if (deltaY < 0 && direction.y === 0) {
          setDirection({ x: 0, y: -1 }); // Up
        }
      }
    }

    setTouchStart(null);
  };

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-hidden">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] mx-auto border-2 border-green-500/50 flex flex-col">
        
        {/* Top controls */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>

          <div className="text-center flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Snake Game
            </h2>
            <p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">
              Score: {score}
            </p>
            {gameOver && (
              <p className="text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm">Game Over!</p>
            )}
            {isPaused && !gameOver && (
              <p className="text-yellow-600 dark:text-yellow-400 font-bold text-xs sm:text-sm">Paused</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Game board */}
        <div 
          className="flex-1 flex items-center justify-center px-3 sm:px-4 min-h-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="bg-gray-200 dark:bg-slate-800 rounded-lg p-1 w-full">
            <div
              className="grid gap-0.5 w-full"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                aspectRatio: '1/1'
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
                const isHead = snake[0] && snake[0][0] === x && snake[0][1] === y;
                const isFood = food[0] === x && food[1] === y;

                return (
                  <div
                    key={index}
                    className={`rounded-sm ${
                      isHead
                        ? 'bg-green-700 dark:bg-green-500'
                        : isSnake
                        ? 'bg-green-600 dark:bg-green-400'
                        : isFood
                        ? 'bg-red-600 dark:bg-red-400'
                        : 'bg-gray-100 dark:bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="p-3 sm:p-4 space-y-2 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Use arrow keys or swipe to control
          </p>
          <button
            onClick={resetGame}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
