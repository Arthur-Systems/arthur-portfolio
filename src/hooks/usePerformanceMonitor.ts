'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function usePerformanceMonitor() {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const fpsRef = useRef(60);

  useEffect(() => {
    let animationFrameId: number;

    const measureFPS = (currentTime: number) => {
      frameCountRef.current++;
      
      if (currentTime - lastTimeRef.current >= 1000) {
        fpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
        
        // Adjust performance based on FPS
        if (fpsRef.current < 30) {
          // Reduce complexity for low FPS
          gsap.ticker.fps(30);
        } else if (fpsRef.current > 55) {
          // Restore full performance
          gsap.ticker.fps(60);
        }
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Mobile performance optimization
  useEffect(() => {
    const isMobile = window.matchMedia('(hover: none)').matches;
    const isLowEndDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile || isLowEndDevice) {
      // Reduce FPS for mobile devices
      gsap.ticker.fps(48);
      
      // Disable some effects on mobile
      document.documentElement.style.setProperty('--mobile-optimized', 'true');
    }
  }, []);

  return {
    fps: fpsRef.current,
    isLowPerformance: fpsRef.current < 30,
  };
} 