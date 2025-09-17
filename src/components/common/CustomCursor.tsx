'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports hover (not touch device)
    const checkTouchDevice = () => {
      const hasHover = window.matchMedia('(hover: hover)').matches;
      setIsTouchDevice(!hasHover);
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Don't initialize custom cursor on touch devices
    if (isTouchDevice) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-interactive]');
      
      if (isInteractive) {
        setIsHovering(true);
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
        });
        gsap.to(follower, {
          scale: 1.5,
          duration: 0.3,
        });
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
      });
      gsap.to(follower, {
        scale: 1,
        duration: 0.3,
      });
    };

    const animate = () => {
      // Smooth cursor movement
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      
      // Follower with more delay
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      
      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
      });
      
      gsap.set(follower, {
        x: followerX,
        y: followerY,
      });
      
      requestAnimationFrame(animate);
    };

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    const animationId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', checkTouchDevice);
    };
  }, [isTouchDevice]);

  // Don't render custom cursor on touch devices or if reduced motion is preferred
  if (isTouchDevice || typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-4 h-4 border-2 border-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        ref={followerRef}
        className="fixed w-8 h-8 bg-primary/10 rounded-full pointer-events-none z-[9998]"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};