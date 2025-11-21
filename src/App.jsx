import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import PageTransition from "./components/PageTransition";
import { usePageTransition } from "./components/usePageTransition";
import Hero from "./components/pages/Hero";
import About from "./components/pages/About";
import Projects from "./components/pages/Projects";
import Experience from "./components/pages/Experience";

function App() {
  const [displayLocation, transitionStage, handleAnimationEnd, isLoading, handlePageLoaded] = usePageTransition();
  const location = useLocation();

  // Simulate page load completion
  useEffect(() => {
    if (isLoading) {
      // Wait for images and components to load
      const timer = setTimeout(() => {
        handlePageLoaded();
      }, 1000); // Minimum 1 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, handlePageLoaded, location]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="font-sans dark:bg-black bg-slate-50 min-h-screen flex flex-col pb-16 lg:pb-0">
        <NavBar />
        <main className="flex-1 mt-5">
          <PageTransition 
            transitionStage={transitionStage} 
            onAnimationEnd={handleAnimationEnd}
            isLoading={isLoading}
          >
            <Routes location={displayLocation}>
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/experience" element={<Experience />} />
            </Routes>
          </PageTransition>
        </main>
        <BottomNav />
      </div>
    </ThemeProvider>
  )
}

export default App
