import React, { useReducer, memo } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeLogo from "./ThemeLogo";
import { ModeToggle } from "./mode-toggle";
import { navItems } from "./data";

const menuReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen };
    case 'CLOSE':
      return { isMenuOpen: false };
    default:
      return state;
  }
};

const NavBar = memo(() => {
  const [state, dispatch] = useReducer(menuReducer, {
    isMenuOpen: false
  });

  const handleNavClick = () => {
    dispatch({ type: 'CLOSE' });
  };

  return (
    <header className="py-1 fixed top-2 ml-[3vw] w-[93vw] rounded-2xl mx-auto z-100 bg-white dark:bg-slate-900 shadow-xl dark:ring-2 dark:ring-blue-500/50 shadow-black/50 dark:shadow-blue-500/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <NavLink to="/" className="flex items-center" onClick={handleNavClick}>
            <ThemeLogo />
          </NavLink>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
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

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <ModeToggle />
            <button
              onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
              className="ml-2 p-2 rounded-lg text-blue-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
              aria-label={state.isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={state.isMenuOpen}
              aria-controls="mobileMenu"
            >
              {state.isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobileMenu"
        className={`sm:hidden fixed top-17 right-[-1px] rounded-l-lg w-64 bg-white dark:bg-slate-900 transform transition-transform duration-300 ease-in-out shadow-lg border-l border-gray-200 dark:border-slate-700 ${
          state.isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col py-6">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `px-6 py-3 text-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-bold'
                    : 'text-blue-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
});


export default NavBar;