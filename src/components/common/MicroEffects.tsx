'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * MicroEffects
 * - Applies subtle hover/press micro-interactions to elements with [data-interactive]
 * - Respects prefers-reduced-motion
 * - Cleans up listeners on unmount
 */
export function MicroEffects() {
  const initialized = useRef(false);
  const listenersRef = useRef<
    Array<{ el: HTMLElement; enter: (e: Event) => void; leave: (e: Event) => void; down: (e: Event) => void; up: (e: Event) => void }>
  >([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const attach = (el: HTMLElement) => {
      const duration = reduced ? 0.12 : 0.22;
      const ease = reduced ? 'power1.out' : 'power3.out';

      const onEnter = () => {
        gsap.to(el, { y: -2, scale: 1.02, duration, ease });
      };
      const onLeave = () => {
        gsap.to(el, { y: 0, scale: 1, duration, ease });
      };
      const onDown = () => {
        gsap.to(el, { scale: 0.98, duration: reduced ? 0.08 : 0.12, ease: 'power2.out' });
      };
      const onUp = () => {
        gsap.to(el, { scale: 1.02, duration: reduced ? 0.08 : 0.12, ease: 'power2.out' });
      };

      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('pointerdown', onDown);
      el.addEventListener('pointerup', onUp);
      listenersRef.current.push({ el, enter: onEnter, leave: onLeave, down: onDown, up: onUp });
    };

    // Initial scan
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-interactive]'));
    nodes.forEach(attach);

    // Observe DOM for dynamically added [data-interactive]
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches?.('[data-interactive]')) attach(n);
          n.querySelectorAll?.('[data-interactive]')?.forEach((child) => attach(child as HTMLElement));
        });
      }
    });
    try {
      mo.observe(document.body, { subtree: true, childList: true });
    } catch {}

    return () => {
      try { mo.disconnect(); } catch {}
      listenersRef.current.forEach(({ el, enter, leave, down, up }) => {
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointerleave', leave);
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointerup', up);
      });
      listenersRef.current = [];
    };
  }, [reduced]);

  return null;
}

export default MicroEffects;


