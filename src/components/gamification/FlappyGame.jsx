import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RotateCcw, Play, Pause } from 'lucide-react';

const FlappyGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappyHighScore') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef(null);
  const touchStartRef = useRef(null);

  // Game state
  const birdRef = useRef({ y: 250, velocity: 0, x: 80 });
  const pipesRef = useRef([]);
  const frameCountRef = useRef(0);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 180;
  const PIPE_SPEED = 3;

  const resetGame = useCallback(() => {
    birdRef.current = { y: 250, velocity: 0, x: 80 };
    pipesRef.current = [];
    frameCountRef.current = 0;
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
  }, []);

  const jump = useCallback(() => {
    if (!gameOver && gameStarted && !isPaused) {
      birdRef.current.velocity = JUMP_STRENGTH;
    }
  }, [gameOver, gameStarted, isPaused]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (gameStarted && !gameOver) {
      setIsPaused(prev => !prev);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const gameLoop = () => {
      if (!gameStarted || gameOver || isPaused) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Clear canvas
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, width, height);

      // Update bird
      birdRef.current.velocity += GRAVITY;
      birdRef.current.y += birdRef.current.velocity;

      // Draw bird
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(birdRef.current.x, birdRef.current.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(birdRef.current.x + 5, birdRef.current.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();

      // Add new pipes
      frameCountRef.current++;
      if (frameCountRef.current % 90 === 0) {
        const gapY = Math.random() * (height - PIPE_GAP - 100) + 50;
        pipesRef.current.push({
          x: width,
          gapY: gapY,
          scored: false
        });
      }

      // Update and draw pipes
      pipesRef.current = pipesRef.current.filter(pipe => {
        pipe.x -= PIPE_SPEED;

        // Draw top pipe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        
        // Draw bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, height - pipe.gapY - PIPE_GAP);

        // Pipe border
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        ctx.strokeRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, height - pipe.gapY - PIPE_GAP);

        // Check collision
        if (
          birdRef.current.x + 15 > pipe.x &&
          birdRef.current.x - 15 < pipe.x + PIPE_WIDTH &&
          (birdRef.current.y - 15 < pipe.gapY || birdRef.current.y + 15 > pipe.gapY + PIPE_GAP)
        ) {
          setGameOver(true);
        }

        // Score
        if (!pipe.scored && pipe.x + PIPE_WIDTH < birdRef.current.x) {
          pipe.scored = true;
          setScore(s => {
            const newScore = s + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('flappyHighScore', newScore.toString());
            }
            return newScore;
          });
        }

        return pipe.x > -PIPE_WIDTH;
      });

      // Check ground/ceiling collision
      if (birdRef.current.y + 15 > height || birdRef.current.y - 15 < 0) {
        setGameOver(true);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, highScore]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else if (gameStarted && !gameOver) {
          jump();
        }
      } else if (e.code === 'KeyP') {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, jump, startGame, togglePause]);

  // Handle touch/click
  const handleInteraction = (e) => {
    e.preventDefault();
    if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  };

  // Touch handlers for swipe detection
  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const deltaY = touchStartRef.current.y - touchEnd.y;
    
    // Swipe up to jump
    if (deltaY > 20) {
      if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    }
    
    touchStartRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-hidden">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] flex flex-col border-2 border-yellow-500/50">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🐦</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Flappy Bird</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Tap or Space to fly!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {gameStarted && !gameOver && (
              <button
                onClick={togglePause}
                className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="p-3 flex flex-col items-center gap-3 overflow-y-auto flex-1 min-h-0">
          <div className="flex justify-between w-full text-center gap-3 flex-shrink-0">
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
            </div>
            <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">High Score</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{highScore}</p>
            </div>
          </div>

          <div className="relative flex-shrink-0 max-w-full">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border-4 border-yellow-500 rounded-lg cursor-pointer bg-sky-200 max-w-full h-auto"
              onClick={handleInteraction}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
            
            {/* Start overlay */}
            {!gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🐦</div>
                  <p className="text-2xl font-bold mb-2">Tap to Start!</p>
                  <p className="text-sm">Press Space or Swipe Up to fly</p>
                </div>
              </div>
            )}

            {/* Pause overlay */}
            {isPaused && gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="text-center text-white">
                  <Pause className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-2xl font-bold">Paused</p>
                  <p className="text-sm mt-2">Press P to continue</p>
                </div>
              </div>
            )}

            {/* Game over overlay */}
            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">💥</div>
                  <p className="text-3xl font-bold mb-2">Game Over!</p>
                  <p className="text-xl mb-1">Score: {score}</p>
                  {score === highScore && score > 0 && (
                    <p className="text-yellow-400 text-sm mb-4">🏆 New High Score!</p>
                  )}
                  <button
                    onClick={resetGame}
                    className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
            <p>🖱️ Click/Tap or Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">Space</kbd> to jump</p>
            <p className="mt-1">Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">P</kbd> to pause</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyGame;
