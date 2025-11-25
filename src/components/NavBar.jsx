import React, { memo, useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeLogo from "./ThemeLogo";
import { ModeToggle } from "./mode-toggle";
import { navItems } from "./data";

const NavBar = memo(({ isLoading = false }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const navRefs = useRef([]);

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  useEffect(() => {
    const activeLink = navRefs.current[activeIndex];
    if (activeLink) {
      setUnderlineStyle({
        width: activeLink.offsetWidth,
        left: activeLink.offsetLeft
      });
    }
  }, [activeIndex]);

  return (
    <header className="py-1 fixed top-2 ml-[3vw] w-[93vw] rounded-2xl mx-auto z-100 bg-white dark:bg-slate-900 shadow-xl dark:ring-2 dark:ring-blue-500/50 shadow-black/50 dark:shadow-blue-500/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <NavLink to="/" className="flex items-center">
            <ThemeLogo />
          </NavLink>
          
          {/* Desktop and Tablet Navigation */}
          <div className="hidden lg:flex items-center space-x-10 relative">
            {/* Sliding underline indicator */}
            <div 
              className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-500 ease-in-out"
              style={{
                width: `${underlineStyle.width}px`,
                left: `${underlineStyle.left}px`
              }}
            />
            
            {navItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <NavLink
                  to={item.path}
                  key={item.name}
                  ref={(el) => (navRefs.current[index] = el)}
                  onClick={(e) => isLoading && e.preventDefault()}
                  className={`mb-1 text-lg relative transition-all duration-300 font-bold ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-blue-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
                  } ${
                    isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                  }`}
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
});

export default NavBar;