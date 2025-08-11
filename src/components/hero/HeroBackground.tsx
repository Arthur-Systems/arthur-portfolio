'use client';

import React, { forwardRef } from 'react';

export interface HeroBackgroundProps {
  className?: string;
}

/**
 * HeroBackground: dark gradient with subtle layered lines for parallax
 */
const HeroBackground = forwardRef<HTMLDivElement, HeroBackgroundProps>(function HeroBackground(
  { className = '' },
  ref
) {
  return (
    <div ref={ref} className={`absolute inset-0 pointer-events-none ${className}`} data-hero-bg>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(45, 212, 191, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.18) 0%, transparent 55%),
            linear-gradient(135deg, #0b1324 0%, #04070f 55%, #0b1324 100%)
          `,
        }}
      />
      <svg
        data-hero-lines
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="rgba(93, 188, 252, 0.12)" strokeWidth="1.1">
          <path d="M-20,520 C180,420 320,480 520,420 C720,360 860,380 1040,300" />
          <path d="M-20,420 C200,340 340,360 540,320 C740,280 900,280 1040,240" />
          <path d="M-20,340 C160,300 320,280 520,260 C740,240 920,220 1040,200" />
        </g>
        <g fill="none" stroke="rgba(168, 85, 247, 0.10)" strokeWidth="1">
          <path d="M-20,560 C120,520 260,540 420,500 C600,450 760,460 1040,420" />
          <path d="M-20,300 C120,280 300,240 520,220 C760,200 920,180 1040,140" />
        </g>
      </svg>
    </div>
  );
});

export default HeroBackground;


