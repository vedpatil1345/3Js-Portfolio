import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import ThemeLogo from "./ThemeLogo";
import { ModeToggle } from "./mode-toggle";
import { navItems } from "./data";

const NavBar = memo(() => {
  return (
    <header className="py-1 fixed top-2 ml-[3vw] w-[93vw] rounded-2xl mx-auto z-100 bg-white dark:bg-slate-900 shadow-xl dark:ring-2 dark:ring-blue-500/50 shadow-black/50 dark:shadow-blue-500/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <NavLink to="/" className="flex items-center">
            <ThemeLogo />
          </NavLink>
          
          {/* Desktop and Tablet Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                className={({ isActive }) =>
                  `relative transition-all duration-300 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-blue-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:font-bold'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <ModeToggle />
          </div>

          {/* Mobile/Tablet Theme Toggle */}
          <div className="lg:hidden flex items-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
});

export default NavBar;