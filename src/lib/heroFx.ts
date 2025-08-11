'use client';

import { gsap } from 'gsap';

let ctx: gsap.Context | null = null;
let masterTl: gsap.core.Timeline | null = null;
let currentRoot: HTMLElement | null = null;

export function initHeroFx(root: HTMLElement) {
  if (!root) return;
  currentRoot = root;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ctx = gsap.context(() => {
    // Tunables
    // Docking clears the H1 by this many pixels (ghost bottom to H1 top)
    const HEADLINE_CLEARANCE_PX = 16;
    const GHOST_INITIAL_SCALE = 1.35;
    const GHOST_INTERMEDIATE_SCALE = 1.0; // after appear, before docking
    const GHOST_FINAL_SCALE = 0.36;

    const APPEAR_DUR = 0.55;
    const DOCK_DUR = 0.7;
    const CONTENT_DUR = 0.5;

    const ghost = root.querySelector('[data-hero-row="0"]') as HTMLElement | null;
    const row1 = root.querySelector('[data-hero-row="1"]') as HTMLElement | null; // H1
    const row2 = root.querySelector('[data-hero-row="2"]') as HTMLElement | null; // Tagline
    const row3 = root.querySelector('[data-hero-row="3"]') as HTMLElement | null; // One-liner
    const row4 = root.querySelector('[data-hero-row="4"]') as HTMLElement | null; // Chips container
    const row5 = root.querySelector('[data-hero-row="5"]') as HTMLElement | null; // CTAs
    const row6 = root.querySelector('[data-hero-row="6"]') as HTMLElement | null; // Meta pills (optional)

    const setInvisible = (el: HTMLElement | null, y = 12) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, y });
    };

    // Reduced motion: skip travel. Place ghost docked above H1 and fade rows quickly
    if (prefersReduced) {
      if (ghost) {
        const parent = ghost.parentElement as HTMLElement;
        const parentRect = parent.getBoundingClientRect();
        const headlineEl = root.querySelector('[data-hero-row="1"]') as HTMLElement | null;
        const headlineRect = headlineEl?.getBoundingClientRect();
        const dockTop = headlineRect
          ? Math.round(headlineRect.top - parentRect.top - ghost.offsetHeight * GHOST_FINAL_SCALE - HEADLINE_CLEARANCE_PX)
          : 0;
        gsap.set(ghost, {
          position: 'absolute',
          top: dockTop,
          left: '50%',
          xPercent: -50,
          transformOrigin: '50% 0%',
          scale: GHOST_FINAL_SCALE,
          opacity: 0,
          pointerEvents: 'none',
        });
        // Calm fade for ghost
        gsap.to(ghost, { opacity: 0.12, duration: 0.12, ease: 'power1.out' });
      }

      [row1, row2, row3, row4, row5, row6].forEach((el) => setInvisible(el, 8));
      const reducedTl = gsap.timeline();
      [row1, row2, row3, row4, row5, row6].forEach((el, i) => {
        if (!el) return;
        reducedTl.to(el, { opacity: 1, y: 0, duration: 0.12, ease: 'power1.out' }, i === 0 ? 0.05 : ">-=0.04");
      });
      return;
    }

    // Initial states
    if (ghost) {
      const parent = ghost.parentElement as HTMLElement;
      const parentRect = parent.getBoundingClientRect();
      const viewportCenterY = window.innerHeight / 2;
      const visualHeight = ghost.offsetHeight * GHOST_INITIAL_SCALE;
      const initialTop = Math.round(viewportCenterY - visualHeight / 2 - parentRect.top);

      gsap.set(ghost, {
        position: 'absolute',
        top: initialTop,
        left: '50%',
        xPercent: -50,
        opacity: 0,
        scale: GHOST_INITIAL_SCALE,
        transformOrigin: '50% 0%',
        pointerEvents: 'none',
      });

      // Store values for docking math via data attributes to avoid recomputing
      (ghost as any).__initialTop = initialTop;
    }

    [row1, row2, row3].forEach((el) => setInvisible(el, 16));
    if (row1) gsap.set(row1, { scale: 0.94 });
    if (row5) gsap.set(row5, { opacity: 0, y: 12, scale: 0.98 });
    if (row4) {
      gsap.set(row4, { opacity: 1 }); // keep container visible, animate its children
      const chips = Array.from(row4.children) as HTMLElement[];
      gsap.set(chips, { opacity: 0, y: 12 });
    }
    if (row6) gsap.set(row6, { opacity: 0, y: 12 });

    masterTl = gsap.timeline();

    // Phase A: ghost appear centered (opacity 0 -> 0.18; scale 1.35 -> 1.0)
    if (ghost) masterTl.to(ghost, { opacity: 0.18, scale: GHOST_INTERMEDIATE_SCALE, duration: APPEAR_DUR, ease: 'power2.out' }, 0);

    // Phase B: dock ghost directly above H1 (y translate only), shrink to final scale and subtle fade
    if (ghost) {
      const parent = ghost.parentElement as HTMLElement;
      const parentRect = parent.getBoundingClientRect();
      const initialTop = (ghost as any).__initialTop as number;
      const headlineEl = root.querySelector('[data-hero-row="1"]') as HTMLElement | null;
      const headlineRect = headlineEl?.getBoundingClientRect();
      const dockTop = headlineRect
        ? Math.round(headlineRect.top - parentRect.top - ghost.offsetHeight * GHOST_FINAL_SCALE - HEADLINE_CLEARANCE_PX)
        : initialTop; // fallback: no move
      const deltaY = dockTop - initialTop;

      masterTl.to(
        ghost,
        {
          y: deltaY,
          scale: GHOST_FINAL_SCALE,
          opacity: 0.12,
          duration: DOCK_DUR,
          ease: 'power2.inOut',
          onComplete: () => ghost.classList.add('is-docked'),
        },
        `>-${Math.min(0.2, APPEAR_DUR * 0.35)}` // overlap with end of appear
      );
    }

    // Row 1 (H1): fade/slide + scale to 1.00, overlapping ghost docking
    if (row1) masterTl.to(row1, { opacity: 1, y: 0, scale: 1, duration: CONTENT_DUR, ease: 'power3.out' }, '>-=0.18');

    // Rows 2 & 3 (copy): staggered with slight overlap
    const copyRows = [row2, row3].filter(Boolean) as HTMLElement[];
    if (copyRows.length) masterTl.to(copyRows, { opacity: 1, y: 0, duration: CONTENT_DUR * 0.9, ease: 'power3.out', stagger: 0.06 }, '>-=0.12');

    // Row 4 (chips): group fade/raise with micro-stagger per chip
    if (row4) {
      const chips = Array.from(row4.children) as HTMLElement[];
      if (chips.length) masterTl.to(chips, { opacity: 1, y: 0, duration: CONTENT_DUR * 0.9, ease: 'power3.out', stagger: 0.04 }, '>-=0.10');
    }

    // Row 5 (CTAs): fade/raise + subtle scale 0.98 -> 1.00
    if (row5) masterTl.to(row5, { opacity: 1, y: 0, scale: 1.0, duration: CONTENT_DUR * 0.9, ease: 'power3.out' }, '>-=0.10');

    // Row 6 (meta pills): quick last fade/raise
    if (row6) masterTl.to(row6, { opacity: 1, y: 0, duration: CONTENT_DUR * 0.7, ease: 'power3.out' }, '>-=0.10');

    // Done. No explicit clearProps; gsap.context(...).revert() on kill will restore styles.
  }, root);
}

export function killHeroFx() {
  try { 
    masterTl?.kill(); 
  } catch {}
  masterTl = null;
  
  if (ctx) { 
    try { 
      // Revert styles on all animated nodes within the root
      ctx.revert(); 
    } catch {} 
    ctx = null; 
    currentRoot = null;
  }
}


