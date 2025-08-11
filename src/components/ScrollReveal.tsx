'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapTimelines';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Direction = 'up' | 'down' | 'left' | 'right';

export interface ScrollRevealProps {
  direction?: Direction;
  ease?: string;
  accentClass?: string;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

/**
 * ScrollReveal
 * - Scrubbed clip-path reveal of the next section while the current recedes
 * - No pinning by default; relies on scroll progress between `top bottom` → `top top`
 * - Respects prefers-reduced-motion with a minimal fade/slide
 */
export function ScrollReveal({
  direction = 'up',
  ease = 'none',
  accentClass,
  className = '',
  children,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [topChild, bottomChild] = useMemo(() => {
    const arr = React.Children.toArray(children);
    return [arr[0] as React.ReactNode, (arr[1] as React.ReactNode) ?? null];
  }, [children]);

  const initialClip = useMemo(() => {
    switch (direction) {
      case 'up':
        return 'inset(0% 0% 100% 0%)'; // hidden from bottom up
      case 'down':
        return 'inset(100% 0% 0% 0%)'; // hidden from top down
      case 'left':
        return 'inset(0% 100% 0% 0%)'; // hidden from right → left reveal
      case 'right':
        return 'inset(0% 0% 0% 100%)'; // hidden from left → right reveal
      default:
        return 'inset(0% 0% 100% 0%)';
    }
  }, [direction]);

  const axis: 'x' | 'y' = useMemo(() => (direction === 'left' || direction === 'right' ? 'x' : 'y'), [direction]);

  useEffect(() => {
    if (!containerRef.current || !topRef.current || !bottomRef.current) return;

    const container = containerRef.current;
    const topEl = topRef.current;
    const bottomEl = bottomRef.current;
    const gradEl = gradientRef.current;

    // Set initial styles (CSS variables for edge indicator)
    bottomEl.style.setProperty('--sr-reveal', '0');
    bottomEl.style.clipPath = initialClip;

    if (reduced) {
      // Minimal, non-scrub reveal on intersection
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              bottomEl.style.transition = 'clip-path 0.15s ease-out, opacity 0.15s ease-out';
              topEl.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
              bottomEl.style.clipPath = 'inset(0% 0% 0% 0%)';
              bottomEl.style.opacity = '1';
              topEl.style.opacity = '0.9';
              topEl.style.transform = axis === 'y' ? 'translateY(-8px)' : 'translateX(-8px)';
              if (gradEl) gradEl.style.opacity = '0';
              io.disconnect();
            }
          });
        },
        { root: null, rootMargin: '0px', threshold: 0.01 }
      );
      io.observe(bottomEl);
      return () => io.disconnect();
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease },
        scrollTrigger: {
          trigger: bottomEl,
          start: 'top 100%', // when bottom section enters from very bottom
          end: 'top 0%', // until its top reaches viewport top
          scrub: true,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      // Reveal the incoming section via clip-path
      tl.fromTo(
        bottomEl,
        { clipPath: initialClip },
        { clipPath: 'inset(0% 0% 0% 0%)' }
      );

      // Soften the edge indicator (driven by CSS var)
      tl.to(
        bottomEl,
        { css: { '--sr-reveal': 1 } },
        0
      );

      // Let the outgoing section gently recede
      tl.to(
        topEl,
        axis === 'y'
          ? { y: -60, opacity: 0.8 }
          : { x: direction === 'left' ? 60 : -60, opacity: 0.8 },
        0.05
      );

      // Debounced refresh on resize and after fonts load
      let resizeTimer: number | null = null;
      const onResize = () => {
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          try { ScrollTrigger.refresh(); } catch {}
        }, 150);
      };
      window.addEventListener('resize', onResize, { passive: true });
      // Font loading can shift layout; refresh once ready
      try {
        // @ts-ignore - FontFaceSet API
        const fonts: FontFaceSet | undefined = (document as any).fonts;
        fonts?.ready?.then(() => {
          try { ScrollTrigger.refresh(); } catch {}
        });
      } catch {}

      return () => {
        window.removeEventListener('resize', onResize as any);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, container);

    return () => ctx.revert();
  }, [axis, direction, ease, initialClip, reduced]);

  // Axis data attribute helps CSS pick gradient orientation
  const axisAttr = axis === 'y' ? 'vertical' : 'horizontal';

  return (
    <div ref={containerRef} className={`sr-container relative ${className}`.trim()} data-sr-container>
      {/* Outgoing (top) section */}
      <div ref={topRef} className="sr-top relative z-10">
        {topChild}
      </div>

      {/* Incoming (bottom) section with clip-path reveal */}
      <div
        ref={bottomRef}
        className={`sr-bottom relative ${accentClass ?? ''}`.trim()}
        data-sr-axis={axisAttr}
        data-sr-direction={direction}
      >
        {/* Edge gradient indicator - purely visual */}
        <div ref={gradientRef} className="sr-edge" aria-hidden="true" />
        {bottomChild}
      </div>
    </div>
  );
}

export default ScrollReveal;


