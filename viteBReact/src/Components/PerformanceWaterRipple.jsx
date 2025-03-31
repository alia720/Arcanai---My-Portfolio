// src/Components/PerformanceWaterRipple.jsx
import React, { useState, useEffect } from 'react';
import WaterRippleScreen from './WaterRipple';
import WaterRippleStatic from './WaterRippleStatic';

const PerformanceWaterRipple = ({ theme }) => {
  const [useStaticBackground, setUseStaticBackground] = useState(false);
  
  useEffect(() => {
    // Check FPS performance on mount
    let frames = 0;
    let lastTime = performance.now();
    let frameId;
    
    const checkPerformance = () => {
      frames++;
      const currentTime = performance.now();
      const elapsedTime = currentTime - lastTime;
      
      // Measure FPS after 1 second
      if (elapsedTime > 1000) {
        const fps = Math.round((frames * 1000) / elapsedTime);
        console.log('Measured FPS:', fps);
        
        // If FPS is below 30, switch to static background
        if (fps < 30) {
          setUseStaticBackground(true);
          cancelAnimationFrame(frameId);
          return;
        }
        
        // Reset counters
        frames = 0;
        lastTime = currentTime;
      }
      
      frameId = requestAnimationFrame(checkPerformance);
    };
    
    // Start performance check
    frameId = requestAnimationFrame(checkPerformance);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);
  
  // Render either dynamic or static background based on performance
  return useStaticBackground ? (
    <WaterRippleStatic theme={theme} />
  ) : (
    <WaterRippleScreen theme={theme} />
  );
};

export default PerformanceWaterRipple;