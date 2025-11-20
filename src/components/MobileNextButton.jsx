import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { navItems } from "./data";

const MobileNextButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find current page index
  const currentIndex = navItems.findIndex(item => item.path === location.pathname);
  
  // Check if we're on first or last page
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex === navItems.length - 1;
  
  // Get next and previous pages
  const nextPage = !isLastPage ? navItems[currentIndex + 1] : null;
  const prevPage = !isFirstPage ? navItems[currentIndex - 1] : null;

  const handleNavigation = (page) => {
    navigate(page.path);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sm:hidden fixed bottom-6 left-0 right-0 z-100 flex justify-between px-6">
      {/* Previous Button */}
      {prevPage && (
        <button
          onClick={() => handleNavigation(prevPage)}
          className="flex gap-2 items-center justify-center cursor-pointer p-3 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-all active:scale-95 text-black dark:text-white shadow-lg"
          aria-label={`Go to ${prevPage.name}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Prev: {prevPage.name}</span>
        </button>
      )}
      
      {/* Next Button */}
      {nextPage && (
        <button
          onClick={() => handleNavigation(nextPage)}
          className="flex gap-2 items-center justify-center cursor-pointer p-3 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-all active:scale-95 text-black dark:text-white ml-auto shadow-lg"
          aria-label={`Go to ${nextPage.name}`}
        >
          <span className="text-sm font-semibold">Next: {nextPage.name}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default MobileNextButton;
