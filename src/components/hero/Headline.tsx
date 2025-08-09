'use client';

import { useRef, useEffect, forwardRef } from 'react';

interface HeadlineProps {
  className?: string;
}

export const Headline = forwardRef<HTMLHeadingElement, HeadlineProps>(({ className = '' }, ref) => {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Forward ref
  useEffect(() => {
    if (ref && headlineRef.current) {
      if (typeof ref === 'function') {
        ref(headlineRef.current);
      } else {
        ref.current = headlineRef.current;
      }
    }
  }, [ref]);

  return (
    <div className={`relative z-20 ${className}`}>
      <div className="text-center">
        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 mb-2 tracking-wide">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Hi, I'm
          </span>
        </div>
        <h1
          ref={headlineRef}
          className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white font-outfit tracking-tight leading-none"
          style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
          }}
        >
          Arthur Wei
        </h1>
      </div>
    </div>
  );
});

Headline.displayName = 'Headline';