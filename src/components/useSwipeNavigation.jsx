import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navItems } from './data';

export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentIndex = useCallback(() => {
    return navItems.findIndex(item => item.path === location.pathname);
  }, [location.pathname]);

  const navigateToPage = useCallback((direction) => {
    const currentIndex = getCurrentIndex();
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % navItems.length;
    } else {
      newIndex = (currentIndex - 1 + navItems.length) % navItems.length;
    }

    navigate(navItems[newIndex].path);
  }, [getCurrentIndex, navigate]);

  // Swipe handling
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum distance for a swipe

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const distance = touchStartX - touchEndX;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        navigateToPage('next');
      } else if (isRightSwipe) {
        navigateToPage('prev');
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigateToPage]);

  // Arrow key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        navigateToPage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateToPage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateToPage]);

  return { navigateToPage };
};
