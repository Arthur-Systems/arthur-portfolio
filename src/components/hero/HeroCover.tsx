'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapTimelines';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type AnyElementRef = RefObject<HTMLDivElement | null> | RefObject<HTMLElement | null>;

interface HeroCoverProps {
  /** Container to pin and use as ScrollTrigger trigger (the hero section) */
  targetRef: AnyElementRef;
  /** Number of vertical blocks; recommended 6–8 */
  blocks?: number;
}

/**
 * Scroll-synced cover animation for the hero.
 * - Pins the hero while blocks rise from bottom in a right→left stagger.
 * - Scrub tied to scroll; reverses on upward scroll.
 * - Respects prefers-reduced-motion by skipping animation to covered state.
 */
export default function HeroCover({ targetRef, blocks = 7 }: HeroCoverProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);
  const reducedMotion = useReducedMotion();

  // Pre-create an array to map over for blocks
  const indices = useMemo(() => Array.from({ length: blocks }, (_, i) => i), [blocks]);

  useEffect(() => {
    const container = (targetRef.current as unknown) as HTMLElement | null;
    const layer = layerRef.current as HTMLDivElement | null;
    if (!container || !layer) return;

    // Guard against zero blocks
    const blocksEls = blockRefs.current.filter(Boolean);
    if (!blocksEls.length) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Start state: all blocks translated below viewport
      gsap.set(blocksEls, { yPercent: 101, force3D: true });

      if (reducedMotion) {
        // Accessibility: jump to covered state, no pinning
        gsap.set(blocksEls, { yPercent: 0 });
        return;
      }

      // Timeline pinned to the hero container
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${Math.round((window.innerHeight || 800) * 1.2)}`,
          scrub: true,
          pin: true, // hero stays fixed during the cover
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Prevent Next's router auto-scroll conflict by managing scroll ourselves
          preventOverlaps: true,
        },
      });

      // Stagger blocks right→left. Using from: 'end' to start with the right-most block
      // Timing: each block begins after the previous progresses a bit (overlap via stagger).
      tl.to(blocksEls, {
        yPercent: 0,
        duration: 1,
        stagger: {
          // Each block starts this many timeline seconds after the previous
          each: 0.2, // slightly longer offset for clearer cascade
          // Right-most first when blocks are in DOM order left→right
          from: 'end',
        },
      });

      // Ensure layout recalculation accounts for pin spacing
      requestAnimationFrame(() => ScrollTrigger.refresh());

      // Cleanup: kill timeline/trigger on unmount
      return () => {
        tl.scrollTrigger?.kill(true);
        tl.kill();
        // Clear transforms in case of hot reload
        gsap.set(blocksEls, { clearProps: 'transform' });
      };
    }, container);

    return () => ctx.revert();
  }, [targetRef, blocks, reducedMotion]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-[40] will-change-transform hero-cover"
      aria-hidden={true}
    >
      <div
        className="h-full w-full grid"
        style={{
          gridTemplateColumns: `repeat(${blocks}, minmax(0, 1fr))`,
          gridTemplateRows: '1fr',
        }}
      >
        {indices.map((i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) blockRefs.current[i] = el;
            }}
            className="hero-cover__block will-change-transform h-full"
            // Slight hue shift across blocks for a branded gradient sweep
            style={{
              // Fallback solid color for browsers without color-mix support
              backgroundColor: 'var(--accent)',
              background: `linear-gradient(180deg, var(--accent), color-mix(in oklab, var(--accent) 70%, white))`,
              // Fully opaque to ensure hero is completely hidden when covered
              opacity: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}


