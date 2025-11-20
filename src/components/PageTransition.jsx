const PageTransition = ({ children, transitionStage, onAnimationEnd, isLoading }) => {
  return (
    <div className="relative w-full">
      {/* Left Door */}
      <div
        className={`fixed top-0 left-0 w-1/2 h-full bg-gradient-to-r from-slate-700 to-slate-600 dark:from-gray-900 dark:to-gray-800 z-50 transition-transform duration-700 ease-in-out ${
          transitionStage === "doorOpen" ? "-translate-x-full" : "translate-x-0"
        }`}
      />
      
      {/* Right Door */}
      <div
        className={`fixed top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-700 to-slate-600 dark:from-gray-900 dark:to-gray-800 z-50 transition-transform duration-700 ease-in-out ${
          transitionStage === "doorOpen" ? "translate-x-full" : "translate-x-0"
        }`}
        onTransitionEnd={onAnimationEnd}
      />
      
      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
            <svg width="64" height="64" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#321fdb" aria-label="loading">
              <g fill="none" fillRule="evenodd" strokeWidth="2">
                <circle cx="22" cy="22" r="1">
                  <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" />
                </circle>
                <circle cx="22" cy="22" r="1">
                  <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        </div>
      )}
      
      {/* Page Content */}
      <div
        className={`w-full transition-opacity duration-500 ${
          transitionStage === "doorOpen" ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;