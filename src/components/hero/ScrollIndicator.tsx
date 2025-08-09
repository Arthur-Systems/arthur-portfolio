'use client';

import { useRef, useEffect, forwardRef } from 'react';
import { gsap } from 'gsap';

interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator = forwardRef<HTMLDivElement, ScrollIndicatorProps>(({ className = '' }, ref) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Forward ref
  useEffect(() => {
    if (ref && indicatorRef.current) {
      if (typeof ref === 'function') {
        ref(indicatorRef.current);
      } else {
        ref.current = indicatorRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (!indicatorRef.current || !arrowRef.current) return;

    // Initial fade-in animation
    gsap.from(indicatorRef.current, {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: 'power2.out',
      delay: 2,
    });

    // Pulse animation for arrow
    const pulseTween = gsap.to(arrowRef.current, {
      y: 8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 2.5,
    });

    return () => {
      pulseTween.kill();
    };
  }, []);

  const handleClick = () => {
    // Smooth scroll to next section
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      ref={indicatorRef}
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Scroll down"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <svg
        ref={arrowRef}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-gray-400 hover:text-white transition-colors duration-300"
      >
        <path
          d="M7 10l5 5 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';