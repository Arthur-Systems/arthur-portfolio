'use client';

import React from 'react';

interface HeroGhostProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function HeroGhost({ className = '', ...rest }: HeroGhostProps) {
  return (
    <div
      data-hero-ghost
      aria-hidden
      className={`pointer-events-none select-none whitespace-nowrap ${className}`}
      style={{
        opacity: 0.16,
        filter: 'blur(0.5px)',
        backgroundImage:
          'linear-gradient(90deg, var(--ghost-from, #5eead4), var(--ghost-via, #818cf8), var(--ghost-to, #a78bfa))',
        backgroundSize: '200% 100%',
        backgroundPosition: 'var(--ghost-pos, 0%) 50%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
      {...rest}
    >
      Hello, I’m
    </div>
  );
}


