import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const EasterEggNotification = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen the easter egg notification
    const hasSeenEasterEggNotification = localStorage.getItem('hasSeenEasterEggNotification');
    
    if (!hasSeenEasterEggNotification) {
      // Show after 3 seconds delay
      const timer = setTimeout(() => {
        setShow(true);
        localStorage.setItem('hasSeenEasterEggNotification', 'true');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShow(false);
        }, 5000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top duration-500">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/20">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <p className="text-sm font-bold">
          🎮 Explore to find hidden Easter eggs & games!
        </p>
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>
    </div>
  );
};

export default EasterEggNotification;
