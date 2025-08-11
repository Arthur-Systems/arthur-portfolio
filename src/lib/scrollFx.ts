'use client';

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * killAllScrollFx
 * Kills all ScrollTriggers and related GSAP timelines.
 * Removes pin spacers and refreshes triggers on next frame.
 */
export function killAllScrollFx() {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill(true));
  } catch {}
  try {
    const spacers = document.querySelectorAll('.gsap-pin-spacer, .pin-spacer');
    spacers.forEach((node) => node.parentElement?.removeChild(node));
  } catch {}
  try {
    gsap.set(['html', 'body'], { clearProps: 'all' });
  } catch {}
  try { ScrollTrigger.clearMatchMedia(); } catch {}
  requestAnimationFrame(() => {
    try { ScrollTrigger.refresh(); } catch {}
  });
}

export default killAllScrollFx;


