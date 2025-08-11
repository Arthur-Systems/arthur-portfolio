// gsapCleanup.ts
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function fullGsapTeardown() {
  // 1. Kill every ScrollTrigger
  ScrollTrigger.getAll().forEach(t => t.kill(true));

  // 2. Kill ScrollSmoother (if one exists)
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.kill();

  // 3. Remove any lingering pin spacer elements created by ScrollTrigger
  try {
    const spacers = document.querySelectorAll('.gsap-pin-spacer, .pin-spacer');
    spacers.forEach((node) => node.parentElement?.removeChild(node));
  } catch {}

  // 4. Restore any inline styles GSAP may have left
  gsap.set(['html', 'body'], { clearProps: 'all' });

  // 5. Clear matchMedia contexts and refresh on next paint so the new page calculates cleanly
  try { ScrollTrigger.clearMatchMedia(); } catch {}
  requestAnimationFrame(() => {
    try { ScrollTrigger.refresh(); } catch {}
  });
}
