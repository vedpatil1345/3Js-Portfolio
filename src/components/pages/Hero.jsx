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

  return (
    <section className="h-screen max-w-screen flex flex-col relative" ref={sectionRef}>
      <div className="mx-auto flex flex-col mt-36 z-10 relative w-full h-full">
        <p className="text-2xl md:text-3xl lg:text-5xl text-center">
          Hi, I am Ved <span className="waving-hand">👋</span>
        </p>
        <p className="gradient-heading">Learn Grow & Inspire.</p>
      </div>
      <div className="absolute top-0 left-0 w-full h-full">
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
              <MemoizedRoom
                ref={roomRef}
                position={sizes.deskPosition}
                rotation={sizes.deskRotation}
                scale={sizes.deskScale}
                castShadow={qualitySettings.shadows}
                receiveShadow={qualitySettings.shadows}
                onAfterRender={() => handleComponentLoad('room')}
              />
            </HeroCamera>

            <color attach="background" args={[backgroundColor]} />

            {theme === "light" ? <MemoizedSky /> : <StarsComponent />}
            
            {/* Only render these components when visible for better performance */}
            {isVisible && (
              <>
                <Suspense fallback={null}>
                  <group position={sizes.carPosition}>
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
                  <MemoizedReactModel
                    ref={reactModelRef}
                    position={sizes.atomPosition}
                    rotation={sizes.atomRotation}
                    scale={sizes.atomScale}
                    onAfterRender={() => handleComponentLoad('reactModel')}
                  />
                </Suspense>
                
                <Suspense fallback={null}>
                  <MemoizedHeroEarth
                    ref={earthRef}
                    position={sizes.earthPosition}
                    scale={sizes.earthScale}
                    onAfterRender={() => handleComponentLoad('earth')}
                  />
                </Suspense>
                
                <Suspense fallback={null}>
                  <group ref={droneRef}>
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
      <div className="absolute bottom-28 md:bottom-18 left-0 right-0 w-full z-20 sm:px-10 px-5">
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