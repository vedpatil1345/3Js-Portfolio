import React, { createContext, useContext, useState, useEffect } from 'react';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [discoveredGames, setDiscoveredGames] = useState([]);
  const [discoveredEasterEggs, setDiscoveredEasterEggs] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [activeEasterEgg, setActiveEasterEgg] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedGames = localStorage.getItem('discoveredGames');
    const savedEggs = localStorage.getItem('discoveredEasterEggs');
    
    if (savedGames) {
      setDiscoveredGames(JSON.parse(savedGames));
    }
    if (savedEggs) {
      setDiscoveredEasterEggs(JSON.parse(savedEggs));
    }
  }, []);

  // Save to localStorage whenever discoveries change
  useEffect(() => {
    localStorage.setItem('discoveredGames', JSON.stringify(discoveredGames));
  }, [discoveredGames]);

  useEffect(() => {
    localStorage.setItem('discoveredEasterEggs', JSON.stringify(discoveredEasterEggs));
  }, [discoveredEasterEggs]);

  const discoverGame = (gameId) => {
    if (!discoveredGames.includes(gameId)) {
      setDiscoveredGames([...discoveredGames, gameId]);
      return true; // First discovery
    }
    return false;
  };

  const discoverEasterEgg = (eggId) => {
    if (!discoveredEasterEggs.includes(eggId)) {
      setDiscoveredEasterEggs([...discoveredEasterEggs, eggId]);
      return true; // First discovery
    }
    return false;
  };

  const openGame = (gameId) => {
    setActiveGame(gameId);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  const openEasterEgg = (eggId) => {
    setActiveEasterEgg(eggId);
  };

  const closeEasterEgg = () => {
    setActiveEasterEgg(null);
  };

  const value = {
    discoveredGames,
    discoveredEasterEggs,
    activeGame,
    activeEasterEgg,
    discoverGame,
    discoverEasterEgg,
    openGame,
    closeGame,
    openEasterEgg,
    closeEasterEgg,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
