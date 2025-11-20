import {
  PerspectiveCamera,
  Environment,
  Stars,
  Float,
  useDetectGPU,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useMemo, memo, useCallback, useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { MyRoom } from "../elements/MyRoom";
import CanvasLoader from "../elements/Loader";
import { useTheme } from "../theme-provider";
import * as THREE from "three";
import HeroCamera from "../elements/HeroCamera";
import { Car } from "../elements/Car";
import { Sky } from "../elements/Sky";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { ReactModel } from "../elements/ReactModel";
import { HeroEarth } from "../elements/HeroEarth";
import Drone from "../elements/Drone";
import { calculateSizes } from "../data";
import { Route, useNavigate } from "react-router-dom";
import Skills from "../elements/Skills";

// Memoize scene elements to prevent unnecessary re-renders
const MemoizedRoom = memo(MyRoom);
const MemoizedCar = memo(Car);
const MemoizedReactModel = memo(ReactModel);
const MemoizedHeroEarth = memo(HeroEarth);
const MemoizedDrone = memo(Drone);
const MemoizedSky = memo(Sky);

// Separate component for stars to prevent re-renders when theme doesn't change
const StarsComponent = memo(() => (
  <Stars saturation={0} count={500} speed={1} />
));

// Model Tooltip Component with Skills integration
const ModelTooltip = memo(({ label, description, position, visible, showSkills }) => {
  if (!visible) return null;
  
  return (
    <div 
      className="absolute pointer-events-none z-30 transition-all duration-300 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: showSkills ? 'translate(-50%, -50%)' : 'translate(-50%, -120%)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className={`backdrop-blur-md rounded-xl shadow-2xl border ${showSkills ? 'bg-gradient-to-br from-blue-50/95 to-indigo-100/95 dark:from-gray-800/95 dark:to-gray-900/95 border-blue-200 dark:border-blue-800 p-5 w-96' : 'bg-white/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700 px-4 py-2'} transition-all duration-300`}>
        {showSkills ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <p className="font-bold text-base text-gray-900 dark:text-white text-center">{label}</p>
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
            </div>
            <div className="h-52 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-gray-700/30 dark:to-gray-800/30 rounded-lg blur-xl"></div>
              <div className="relative z-10">
                <Skills />
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 pt-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse delay-150"></div>
            </div>
          </div>
        ) : (
          <>
            <p className="font-semibold text-sm text-gray-900 dark:text-white whitespace-nowrap">{label}</p>
            {description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{description}</p>
            )}
          </>
        )}
      </div>
      {!showSkills && (
        <div className="w-2 h-2 bg-white dark:bg-gray-800 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-gray-200 dark:border-gray-700"></div>
      )}
    </div>
  );
});

// Effects component to avoid duplicate EffectComposers
// Fixed to handle refs properly with null checks and using current property
const SceneEffects = ({ lightRefs, objectRefs, droneRef }) => {
  // Only render effects when all refs are available
  const shouldRender = useMemo(() => {
    const lights = lightRefs.filter(ref => ref.current).map(ref => ref.current);
    const objects = objectRefs.current ? [objectRefs.current] : [];
    const drone = droneRef.current ? [droneRef.current] : [];
    
    return lights.length > 0 && (objects.length > 0 || drone.length > 0);
  }, [lightRefs, objectRefs, droneRef]);

  if (!shouldRender) return null;

  return (
    <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
      {/* Only apply bloom effect if object refs are available */}
      {objectRefs.current && (
        <SelectiveBloom
          lights={lightRefs.filter(ref => ref.current).map(ref => ref.current)}
          selection={objectRefs.current ? [objectRefs.current] : []}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.1}
        />
      )}
      
      {/* Only apply drone bloom effect if drone ref is available */}
      {droneRef.current && (
        <SelectiveBloom
          lights={lightRefs.filter(ref => ref.current).map(ref => ref.current)}
          selection={droneRef.current ? [droneRef.current] : []}
          luminanceThreshold={2}
          mipmapBlur
        />
      )}
    </EffectComposer>
  );
};

// Optimize the button component with memo
const Button = memo(({ name, isBeam = false, containerClass }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/about')}
      className={`flex gap-4 items-center justify-center cursor-pointer p-3 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-all active:scale-95 text-black dark:text-white mx-auto ${containerClass}`}
    >
      {isBeam && (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 dark:bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-800 dark:bg-green-500"></span>
        </span>
      )}
      {name}
    </button>
  );
});

function Hero() {
  const { theme } = useTheme();
  const ismobile = useMediaQuery({ query: "(max-width: 640px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);
  const GPUTier = useDetectGPU();
  
  // Tooltip states
  const [hoveredModel, setHoveredModel] = useState(null);
  const [tooltipPositions, setTooltipPositions] = useState({});
  const canvasRef = useRef(null);

  // Use Intersection Observer to detect when section is visible
  useEffect(() => {
    // Only setup the observer if the browser supports it
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Should be only one entry since we're observing a single element
        if (entries[0]) {
          setIsVisible(entries[0].isIntersecting);
        }
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1, // trigger when at least 10% is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // Use useMemo to prevent recalculation on every render
  const sizes = useMemo(
    () => calculateSizes(ismobile, isTablet),
    [ismobile, isTablet]
  );

  // Create refs for objects and lights
  const roomRef = useRef();
  const carRef = useRef();
  const reactModelRef = useRef();
  const earthRef = useRef();
  const droneRef = useRef();
  const lightRef1 = useRef();
  const lightRef2 = useRef();

  // Ensure all object refs are collected in one place for SceneEffects
  const objectRefs = useMemo(() => {
    return [roomRef, carRef, reactModelRef, earthRef].filter(ref => ref.current);
  }, []);

  // Adjust quality settings based on device capabilities
  const qualitySettings = useMemo(() => {
    const isMobileLowPower = ismobile && (!GPUTier || GPUTier.tier < 2);
    
    return {
      shadows: !isMobileLowPower,
      dpr: [1, isMobileLowPower ? 1 : ismobile ? 1.5 : 2],
      shadowMapSize: isMobileLowPower ? 256 : ismobile ? 512 : 1024,
      environmentPreset: theme === "light" ? "warehouse" : "sunset",
      ambientIntensity: isMobileLowPower ? 0.6 : ismobile ? 0.8 : 1,
      directionalIntensity: isMobileLowPower ? 0.3 : ismobile ? 0.4 : 0.5,
    };
  }, [ismobile, GPUTier, theme]);

  // Memoize background color to prevent recreating the color object
  const backgroundColor = useMemo(
    () => new THREE.Color(theme === "light" ? "white" : "black"),
    [theme]
  );

  // Track whether 3D components have loaded
  const [componentsLoaded, setComponentsLoaded] = useState({
    room: false,
    car: false,
    reactModel: false,
    earth: false,
    drone: false
  });

  // Only render effects when core components are loaded
  const shouldRenderEffects = useMemo(() => {
    return isVisible && componentsLoaded.room;
  }, [isVisible, componentsLoaded]);

  // Handle component load events
  const handleComponentLoad = useCallback((componentName) => {
    setComponentsLoaded(prev => ({
      ...prev,
      [componentName]: true
    }));
  }, []);

  // Model tooltips data
  const modelTooltips = {
    room: { label: "My Workspace", description: "Full-Stack Development" },
    car: { label: "Creative Design", description: "UI/UX & Animation" },
    react: { label: "Frontend Magic", description: "React & Three.js" },
    earth: { label: "Backend & APIs", description: "Server-Side Solutions" },
    drone: { label: "Innovation & Tech", description: "Future of Development" }
  };

  return (
    <section className="h-screen max-w-screen flex flex-col relative" ref={sectionRef}>
      {/* Tooltips Layer */}
      {!ismobile && (
        <>
          <ModelTooltip 
            label={modelTooltips.car.label} 
            description={modelTooltips.car.description}
            position={tooltipPositions.car || { x: 0, y: 0 }}
            visible={hoveredModel === 'car'}
          />
          <ModelTooltip 
            label={modelTooltips.react.label} 
            description={modelTooltips.react.description}
            position={tooltipPositions.react || { x: 0, y: 0 }}
            visible={hoveredModel === 'react'}
          />
          <ModelTooltip 
            label={modelTooltips.earth.label} 
            description={modelTooltips.earth.description}
            position={tooltipPositions.earth || { x: 0, y: 0 }}
            visible={hoveredModel === 'earth'}
          />
          <ModelTooltip 
            label={modelTooltips.drone.label} 
            description={modelTooltips.drone.description}
            position={tooltipPositions.drone || { x: 0, y: 0 }}
            visible={hoveredModel === 'drone'}
          />
        </>
      )}
      
      <div className="mx-auto flex flex-col mt-36 z-10 relative w-full h-full pointer-events-none">
        <p className="text-2xl md:text-3xl lg:text-5xl text-center">
          Hi, I am Ved <span className="waving-hand">👋</span>
        </p>
        <p className="gradient-heading">Learn Grow & Inspire.</p>
      </div>
      <div className="absolute top-0 left-0 w-full h-full" ref={canvasRef}>
        <Canvas
          shadows={qualitySettings.shadows}
          className="h-full w-full z-0"
          dpr={qualitySettings.dpr}
          performance={{ min: 0.5 }}
          frameloop={isVisible ? "always" : "demand"}
          eventSource={document.getElementById("root")}
          eventPrefix="client"
        >
          <Suspense fallback={<CanvasLoader />}>
            <Environment preset={qualitySettings.environmentPreset} />
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

            <ambientLight intensity={qualitySettings.ambientIntensity} ref={lightRef1} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={qualitySettings.directionalIntensity}
              castShadow={qualitySettings.shadows}
              shadow-mapSize-width={qualitySettings.shadowMapSize}
              shadow-mapSize-height={qualitySettings.shadowMapSize}
              ref={lightRef2}
            />

            <HeroCamera isMobile={ismobile}>
              <group>
                <MemoizedRoom
                  ref={roomRef}
                  position={sizes.deskPosition}
                  rotation={sizes.deskRotation}
                  scale={sizes.deskScale}
                  castShadow={qualitySettings.shadows}
                  receiveShadow={qualitySettings.shadows}
                  onAfterRender={() => handleComponentLoad('room')}
                />
              </group>
            </HeroCamera>

            <color attach="background" args={[backgroundColor]} />

            {theme === "light" ? <MemoizedSky /> : <StarsComponent />}
            
            {/* Only render these components when visible for better performance */}
            {isVisible && (
              <>
                <Suspense fallback={null}>
                  <group 
                    position={sizes.carPosition}
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      setHoveredModel('car');
                      if (canvasRef.current) {
                        const rect = canvasRef.current.getBoundingClientRect();
                        setTooltipPositions(prev => ({
                          ...prev,
                          car: { x: rect.width * 0.7, y: rect.height * 0.7 }
                        }));
                      }
                    }}
                    onPointerOut={() => setHoveredModel(null)}
                  >
                    <MemoizedCar
                      ref={carRef}
                      rotation={sizes.carRotation}
                      scale={sizes.carScale}
                      castShadow={qualitySettings.shadows}
                      receiveShadow={qualitySettings.shadows}
                      onAfterRender={() => handleComponentLoad('car')}
                    />
                  </group>
                </Suspense>

                <Suspense fallback={null}>
                  <group
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      setHoveredModel('react');
                      if (canvasRef.current) {
                        const rect = canvasRef.current.getBoundingClientRect();
                        setTooltipPositions(prev => ({
                          ...prev,
                          react: { x: rect.width * 0.75, y: rect.height * 0.3 }
                        }));
                      }
                    }}
                    onPointerOut={() => setHoveredModel(null)}
                  >
                    <MemoizedReactModel
                      ref={reactModelRef}
                      position={sizes.atomPosition}
                      rotation={sizes.atomRotation}
                      scale={sizes.atomScale}
                      onAfterRender={() => handleComponentLoad('reactModel')}
                    />
                  </group>
                </Suspense>
                
                <Suspense fallback={null}>
                  <group
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      setHoveredModel('earth');
                      if (canvasRef.current) {
                        const rect = canvasRef.current.getBoundingClientRect();
                        setTooltipPositions(prev => ({
                          ...prev,
                          earth: { x: rect.width * 0.25, y: rect.height * 0.3 }
                        }));
                      }
                    }}
                    onPointerOut={() => setHoveredModel(null)}
                  >
                    <MemoizedHeroEarth
                      ref={earthRef}
                      position={sizes.earthPosition}
                      scale={sizes.earthScale}
                      onAfterRender={() => handleComponentLoad('earth')}
                    />
                  </group>
                </Suspense>
                
                <Suspense fallback={null}>
                  <group 
                    ref={droneRef}
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      setHoveredModel('drone');
                      if (canvasRef.current) {
                        const rect = canvasRef.current.getBoundingClientRect();
                        setTooltipPositions(prev => ({
                          ...prev,
                          drone: { x: rect.width * 0.3, y: rect.height * 0.7 }
                        }));
                      }
                    }}
                    onPointerOut={() => setHoveredModel(null)}
                  >
                    <MemoizedDrone
                      position={sizes.dronePosition}
                      scale={sizes.droneScale}
                      onAfterRender={() => handleComponentLoad('drone')}
                    />
                  </group>
                </Suspense>

                {shouldRenderEffects && (
                  <SceneEffects
                    lightRefs={[lightRef1, lightRef2]}
                    objectRefs={roomRef}
                    droneRef={droneRef}
                  />
                )}
              </>
            )}
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute bottom-28 md:bottom-18 left-0 right-0 w-full z-20 sm:px-10 px-5 pointer-events-auto">
        <Button
          name="Let's work together"
          isBeam
          containerClass="sm:w-fit w-full sm:min-w-96"
        />
      </div>
    </section>
  );
}

// Create a higher-order component for better performance management
export default memo(Hero);