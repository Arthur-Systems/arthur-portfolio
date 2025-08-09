// DOM-only fallback version: previous R3F-based scene removed.
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsapTimelines';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Loader } from '@/state/loaderBus';
import { useUIReady } from '@/hooks/useUIReady';

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const { setStep } = useUIReady();

  useEffect(() => {
    setStep('Initializing visuals…');
    Loader.step(5, 'Hero visuals…');
    const ctx = gsap.context(() => {
      if (!reduced && orbRef.current) {
        gsap.fromTo(
          orbRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
        );
        gsap.to(orbRef.current, {
          y: -12,
          yoyo: true,
          repeat: -1,
          duration: 2.2,
          ease: 'sine.inOut',
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [reduced, setStep]);

  return (
    <div ref={containerRef} className="relative w-full h-full pointer-events-none">
      <div
        ref={orbRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(34,211,238,0.9), rgba(59,130,246,0.35) 45%, rgba(59,130,246,0) 70%)',
          filter: 'blur(0.2px)',
          boxShadow: '0 0 120px rgba(59,130,246,0.25)',
        }}
      />
      <svg
        ref={linesRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="rgba(93, 188, 252, 0.14)" strokeWidth="1.2">
          <path d="M-20,520 C180,420 320,480 520,420 C720,360 860,380 1040,300" />
          <path d="M-20,420 C200,340 340,360 540,320 C740,280 900,280 1040,240" />
          <path d="M-20,340 C160,300 320,280 520,260 C740,240 920,220 1040,200" />
        </g>
        <g fill="none" stroke="rgba(168, 85, 247, 0.12)" strokeWidth="1">
          <path d="M-20,560 C120,520 260,540 420,500 C600,450 760,460 1040,420" />
          <path d="M-20,300 C120,280 300,240 520,220 C760,200 920,180 1040,140" />
        </g>
      </svg>
    </div>
  );
}