'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export type AutoRevealOptions = {
  selector?: string;
  root?: HTMLElement | null;
  stagger?: number;
  y?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
};

/**
 * useAutoReveal
 * - Reveals elements on scroll using GSAP ScrollTrigger
 * - Targets children of root matching `selector` (default: [data-reveal])
 * - Respects prefers-reduced-motion
 */
export function useAutoReveal(options: AutoRevealOptions = {}) {
  const {
    selector = '[data-reveal]',
    root = null,
    stagger = 0.08,
    y = 16,
    opacity = 0,
    duration = 0.6,
    ease = 'power3.out',
  } = options;
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = root ?? (typeof document !== 'undefined' ? document.body : null);
    if (!container) return;

    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      elements.forEach((el, i) => {
        gsap.set(el, { opacity, y });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.18 : duration,
              ease: reduced ? 'power1.out' : ease,
              delay: reduced ? 0 : i * (reduced ? 0.02 : stagger),
            });
          },
        });
      });
    }, container);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, root, stagger, y, opacity, duration, ease, reduced]);
}

export default useAutoReveal;


