import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';

const TicTacToe = ({ onClose }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState(null); // null means choosing
  const [computerSymbol, setComputerSymbol] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  };

  const makeComputerMove = (currentBoard) => {
    const emptySquares = currentBoard
      .map((val, idx) => val === null ? idx : null)
      .filter(val => val !== null);

    if (emptySquares.length === 0) return;

    // Try to win
    for (let i of emptySquares) {
      const testBoard = [...currentBoard];
      testBoard[i] = computerSymbol;
      if (calculateWinner(testBoard)?.winner === computerSymbol) {
        return i;
      }
    }

    // Block player from winning
    for (let i of emptySquares) {
      const testBoard = [...currentBoard];
      testBoard[i] = playerSymbol;
      if (calculateWinner(testBoard)?.winner === playerSymbol) {
        return i;
      }
    }

    // Take center if available
    if (emptySquares.includes(4)) return 4;

    // Take a corner
    const corners = [0, 2, 6, 8].filter(i => emptySquares.includes(i));
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take any available square
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const handleSymbolChoice = (symbol) => {
    setPlayerSymbol(symbol);
    setComputerSymbol(symbol === 'X' ? 'O' : 'X');
    
    // If player chooses O, computer (X) goes first
    if (symbol === 'O') {
      setIsXNext(true);
      setIsComputerThinking(true);
      setTimeout(() => {
        const newBoard = [...board];
        newBoard[4] = 'X'; // Computer takes center
        setBoard(newBoard);
        setIsXNext(false);
        setIsComputerThinking(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (!playerSymbol) return; // Don't do anything until player chooses

    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else if (board.every(square => square !== null)) {
      setWinner('Draw');
    } else {
      // Check if it's computer's turn
      const isComputerTurn = (isXNext && computerSymbol === 'X') || (!isXNext && computerSymbol === 'O');
      
      if (isComputerTurn && !winner) {
        setIsComputerThinking(true);
        const timeoutId = setTimeout(() => {
          const move = makeComputerMove(board);
          if (move !== undefined) {
            const newBoard = [...board];
            newBoard[move] = computerSymbol;
            setBoard(newBoard);
            setIsXNext(!isXNext);
          }
          setIsComputerThinking(false);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [board, isXNext, winner, playerSymbol, computerSymbol]);

  const handleClick = (index) => {
    if (!playerSymbol || board[index] || winner || isComputerThinking) return;
    
    // Check if it's player's turn
    const isPlayerTurn = (isXNext && playerSymbol === 'X') || (!isXNext && playerSymbol === 'O');
    if (!isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setPlayerSymbol(null);
    setComputerSymbol(null);
    setIsComputerThinking(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-hidden">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full mx-4 border-2 border-blue-500/50 max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4 text-gray-900 dark:text-white">
          Tic-Tac-Toe
        </h2>

        {!playerSymbol ? (
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Choose your side:
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => handleSymbolChoice('X')}
                className="flex-1 py-6 sm:py-8 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-3xl sm:text-4xl rounded-lg transition-all hover:scale-105"
              >
                X
              </button>
              <button
                onClick={() => handleSymbolChoice('O')}
                className="flex-1 py-6 sm:py-8 px-4 sm:px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-3xl sm:text-4xl rounded-lg transition-all hover:scale-105"
              >
                O
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              X goes first!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 sm:mb-4 text-center">
              {winner ? (
                <p className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {winner === 'Draw' ? "It's a Draw!" : winner === playerSymbol ? 'You Win! 🎉' : 'Computer Wins!'}
                </p>
              ) : isComputerThinking ? (
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  Computer is thinking...
                </p>
              ) : (
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  {(isXNext && playerSymbol === 'X') || (!isXNext && playerSymbol === 'O') 
                    ? `Your Turn (${playerSymbol})` 
                    : `Computer's Turn (${computerSymbol})`}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
              {board.map((value, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`aspect-square flex items-center justify-center text-3xl sm:text-4xl font-bold rounded-lg transition-all ${
                    winningLine.includes(index)
                      ? 'bg-green-500 dark:bg-green-600'
                      : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
                  } ${
                    value === 'X'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                  disabled={!!winner || !!value}
                >
                  {value}
                </button>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
