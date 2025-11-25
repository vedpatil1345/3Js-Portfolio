import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Smartphone, Monitor } from 'lucide-react';

const Tutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial before
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }

    // Detect if mobile or desktop
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };

  if (!showTutorial) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-[200] animate-in slide-in-from-bottom duration-500">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xs p-4 border-2 border-blue-500/50">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
          aria-label="Close tutorial"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            {isMobile ? (
              <Smartphone className="w-5 h-5 text-blue-500" />
            ) : (
              <Monitor className="w-5 h-5 text-blue-500" />
            )}
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Navigation Tip 💡
            </h3>
          </div>

          {isMobile ? (
            <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4 text-blue-500" />
                <span>Swipe right for previous</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                <span>Swipe left for next</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded text-xs">←</kbd>
                <span>Previous page</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded text-xs">→</kbd>
                <span>Next page</span>
              </div>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full mt-3 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Got it! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
