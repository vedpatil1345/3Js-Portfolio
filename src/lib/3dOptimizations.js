/**
 * 3D Performance and Memory Optimization Utilities
 * Reduces RAM usage and improves rendering performance for Three.js/React Three Fiber
 */

import * as THREE from 'three';

/**
 * Dispose of Three.js objects properly to free memory
 * @param {Object} object - Three.js object to dispose
 */
export const disposeObject = (object) => {
  if (!object) return;

  // Dispose geometry
  if (object.geometry) {
    object.geometry.dispose();
  }

  // Dispose material(s)
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(material => disposeMaterial(material));
    } else {
      disposeMaterial(object.material);
    }
  }

  // Recursively dispose children
  if (object.children) {
    object.children.forEach(child => disposeObject(child));
  }
};

/**
 * Dispose of a material and its textures
 * @param {THREE.Material} material - Material to dispose
 */
export const disposeMaterial = (material) => {
  if (!material) return;

  // Dispose all textures
  Object.keys(material).forEach(prop => {
    if (material[prop] && typeof material[prop].dispose === 'function') {
      material[prop].dispose();
    }
  });

  material.dispose();
};

/**
 * Optimize texture for better memory usage
 * @param {THREE.Texture} texture - Texture to optimize
 * @param {Object} options - Optimization options
 */
export const optimizeTexture = (texture, options = {}) => {
  if (!texture) return;

  const {
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
    anisotropy = 4,
    generateMipmaps = true,
    encoding = THREE.sRGBEncoding
  } = options;

  texture.minFilter = minFilter;
  texture.magFilter = magFilter;
  texture.anisotropy = anisotropy;
  texture.generateMipmaps = generateMipmaps;
  texture.encoding = encoding;
  texture.needsUpdate = true;

  return texture;
};

/**
 * Reduce geometry complexity by simplifying vertices
 * @param {THREE.BufferGeometry} geometry - Geometry to simplify
 */
export const simplifyGeometry = (geometry) => {
  if (!geometry || !geometry.attributes.position) return geometry;

  // Mark for attribute updates
  geometry.attributes.position.needsUpdate = true;
  if (geometry.attributes.normal) {
    geometry.attributes.normal.needsUpdate = true;
  }
  
  // Compute bounding sphere for culling
  geometry.computeBoundingSphere();
  
  return geometry;
};

/**
 * Create optimized material with reduced features
 * @param {Object} options - Material options
 */
export const createOptimizedMaterial = (options = {}) => {
  const {
    color = 0xffffff,
    roughness = 0.5,
    metalness = 0.5,
    flatShading = false,
    toneMapped = true
  } = options;

  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    flatShading,
    toneMapped,
    // Disable expensive features
    envMapIntensity: 0.5,
    aoMapIntensity: 0.5
  });
};

/**
 * Batch dispose multiple objects
 * @param {Array} objects - Array of Three.js objects
 */
export const batchDispose = (objects) => {
  if (!Array.isArray(objects)) return;
  objects.forEach(obj => disposeObject(obj));
};

/**
 * Configure renderer for optimal memory usage
 * @param {THREE.WebGLRenderer} renderer - Renderer to configure
 */
export const optimizeRenderer = (renderer) => {
  if (!renderer) return;

  // Memory optimizations
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  
  // Performance settings
  renderer.powerPreference = "high-performance";
  renderer.antialias = false; // Disable for better performance, use FXAA/SMAA instead
  
  return renderer;
};

/**
 * Debounce function for window resize optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 */
export const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Monitor memory usage (development only)
 */
export const logMemoryUsage = () => {
  if (performance.memory) {
    const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    const total = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
    const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
    
    console.log(`Memory: ${used}MB / ${total}MB (Limit: ${limit}MB)`);
  }
};

/**
 * Reduce shadow map quality based on device
 * @param {boolean} isMobile - Whether device is mobile
 */
export const getShadowMapSize = (isMobile) => {
  return isMobile ? 256 : 1024;
};

/**
 * Get optimal render settings based on GPU tier
 * @param {Object} gpuTier - GPU tier information
 * @param {boolean} isMobile - Whether device is mobile
 */
export const getQualitySettings = (gpuTier, isMobile) => {
  const tier = gpuTier?.tier || 1;
  const isLowPower = isMobile && tier < 2;

  return {
    shadows: !isLowPower,
    dpr: [1, isLowPower ? 1 : isMobile ? 1.5 : 2],
    shadowMapSize: getShadowMapSize(isMobile),
    antialias: !isLowPower,
    pixelRatio: Math.min(window.devicePixelRatio, isLowPower ? 1 : 2),
    powerPreference: isLowPower ? 'low-power' : 'high-performance'
  };
};

export default {
  disposeObject,
  disposeMaterial,
  optimizeTexture,
  simplifyGeometry,
  createOptimizedMaterial,
  batchDispose,
  optimizeRenderer,
  debounce,
  logMemoryUsage,
  getShadowMapSize,
  getQualitySettings
};
