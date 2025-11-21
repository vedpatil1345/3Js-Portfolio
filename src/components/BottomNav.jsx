import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, User, Briefcase, Award } from "lucide-react";

const BottomNav = ({ isLoading = false }) => {
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: User },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Experience", path: "/experience", icon: Award },
  ];

  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  return (
    <nav className="lg:hidden fixed bottom-2 left-[3vw] right-[3vw] z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:ring-2 dark:ring-blue-500/50 shadow-black/50 dark:shadow-blue-500/50">
      <div className="flex justify-around items-center h-16 relative">
        {/* Sliding bubble */}
        <div 
          className="border-t-2 border-blue-600 dark:border-blue-400 absolute h-14 bg-blue-100 dark:bg-blue-900/30 rounded-t-3xl transition-all duration-500 ease-in-out"
          style={{
            width: `calc(100% / ${navItems.length})`,
            left: `${activeIndex * (100 / navItems.length)}%`,
            transform: 'translateY(-50%)',
            top: '50%'
          }}
        >
          <div className="w-full h-full px-4 flex items-center justify-center">
            <div className="w-full h-full" />
          </div>
        </div>
        
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={(e) => isLoading && e.preventDefault()}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative z-10 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              } ${
                isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
              <span className={`text-xs mt-1 transition-all duration-200 ${isActive ? "font-semibold" : ""}`}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
