// usePageTransition.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("doorOpen");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("doorClose");
      setIsLoading(true);
    }
  }, [location, displayLocation]);
  
  const handleAnimationEnd = () => {
    if (transitionStage === "doorClose") {
      setDisplayLocation(location);
      // Keep doors closed until page signals it's loaded
    }
  };

  const handlePageLoaded = () => {
    setIsLoading(false);
    setTransitionStage("doorOpen");
  };
  
  return [displayLocation, transitionStage, handleAnimationEnd, isLoading, handlePageLoaded];
}