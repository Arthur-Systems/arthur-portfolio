'use client';

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimeInstanceLite = { pause?: () => void; play?: () => void };
type AnimeFn = (params: Record<string, unknown>) => AnimeInstanceLite;

let _anime: AnimeFn | null = null;
async function getAnime(): Promise<AnimeFn | null> {
  if (_anime) return _anime;
  try {
    const mod = await import('animejs');
    const maybeFn: unknown = (mod as any).default ?? (mod as any).anime ?? mod;
    _anime = typeof maybeFn === 'function' ? (maybeFn as AnimeFn) : null;
    return _anime;
  } catch {}
  return null;
}

let ctx: gsap.Context | null = null;
let tl: gsap.core.Timeline | null = null;
let currentRoot: HTMLElement | null = null;

// Track hover cleanup
const hoverTargets: HTMLElement[] = [];

export function initMetaFx(root: HTMLElement) {
  currentRoot = root;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ctx = gsap.context(() => {
    const container = root.querySelector('[data-meta-cards]') as HTMLElement | null;
    const sf = root.querySelector('[data-about-location]') as HTMLElement | null;
    const aws = root.querySelector('[data-about-cert]') as HTMLElement | null;
    const hoverEls = Array.from(root.querySelectorAll('[data-meta-hover]')) as HTMLElement[];

    if (!container) return;

    // Initial states
    if (!prefersReduced) {
      if (sf) gsap.set(sf, { opacity: 0, y: 20, x: -16, rotateY: -4, transformPerspective: 1000 });
      if (aws) gsap.set(aws, { opacity: 0, y: 20, x: 16, rotateY: 4, transformPerspective: 1000 });
    } else {
      [sf, aws].forEach((el) => el && gsap.set(el, { opacity: 0 }));
    }

    const play = () => {
      const ease = 'power3.out';
      tl = gsap.timeline({ defaults: { ease } });
      if (!prefersReduced) {
        if (sf) tl.to(sf, { opacity: 1, x: 0, y: 0, rotateY: 0, duration: 0.55 }, 0);
        if (aws) tl.to(aws, { opacity: 1, x: 0, y: 0, rotateY: 0, duration: 0.55 }, 0.18);
      } else {
        if (sf) tl.to(sf, { opacity: 1, duration: 0.18 }, 0);
        if (aws) tl.to(aws, { opacity: 1, duration: 0.18 }, 0.1);
      }
    };

    ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      once: true,
      onEnter: play,
    });

    // Hover micro-interactions with anime.js
    setupHover(hoverEls);
  }, root);
}

function setupHover(targets: HTMLElement[]) {
  const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  hoverTargets.splice(0, hoverTargets.length, ...targets);
  targets.forEach((el) => {
    let hover = false;
    let lastShineAt = 0;
    let raf: number | null = null;

    const onMove = (e: PointerEvent) => {
      if (!hover || !hasFinePointer) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const maxRX = 3;
      const maxRY = 6;
      const rx = Math.max(Math.min(-dy * maxRX, maxRX), -maxRX);
      const ry = Math.max(Math.min(dx * maxRY, maxRY), -maxRY);
      const tz = 8; // translateZ

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(async () => {
        const anime = await getAnime();
        if (!anime) return;
        el.style.willChange = 'transform';
        try { (anime as any)?.remove?.(el); } catch {}
        anime({
          targets: el,
          rotateX: rx,
          rotateY: ry,
          translateZ: tz,
          duration: 140,
          easing: 'easeOutQuad',
        });
      });
    };

    const onEnter = async () => {
      hover = true;
      const anime = await getAnime();
      if (!anime) return;
      // Shine sweep
      const shine = el.querySelector('[data-shine]') as HTMLElement | null;
      const now = Date.now();
      if (shine && now - lastShineAt > 700) {
        lastShineAt = now;
        shine.style.opacity = '1';
        try { (anime as any)?.remove?.(shine); } catch {}
        anime({
          targets: shine,
          translateX: ['-120%', '120%'],
          duration: 700,
          easing: 'easeOutCubic',
          complete: () => {
            if (shine) {
              shine.style.opacity = '0';
              shine.style.transform = 'translateX(-120%)';
            }
          },
        });
      }
    };

    const onLeave = async () => {
      hover = false;
      if (raf) cancelAnimationFrame(raf);
      const anime = await getAnime();
      if (!anime) return;
      try { (anime as any)?.remove?.(el); } catch {}
      anime({
        targets: el,
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        duration: 200,
        easing: 'easeOutQuad',
        complete: () => {
          el.style.willChange = '';
        },
      });
    };

    el.addEventListener('pointermove', onMove as any);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);
    el.addEventListener('touchend', onLeave, { passive: true });

    // Keep references for cleanup by attaching to element
    (el as any).__metaHandlers = { onMove, onEnter, onLeave } as const;
  });
}

export function killMetaFx() {
  try { tl?.kill(); } catch {}
  tl = null;
  if (ctx) {
    try { ctx.revert(); } catch {}
    ctx = null;
  }
  // Remove listeners and anime transforms
  hoverTargets.forEach((el) => {
    const h = (el as any).__metaHandlers as
      | { onMove: (e: PointerEvent) => void; onEnter: () => void; onLeave: () => void }
      | undefined;
    if (h) {
      el.removeEventListener('pointermove', h.onMove as any);
      el.removeEventListener('pointerenter', h.onEnter);
      el.removeEventListener('pointerleave', h.onLeave);
      el.removeEventListener('pointercancel', h.onLeave);
      el.removeEventListener('touchend', h.onLeave as any);
      delete (el as any).__metaHandlers;
    }
    if (_anime && typeof _anime === 'function') {
      try { (_anime as any)?.remove?.(el); } catch {}
    }
  });
  hoverTargets.length = 0;
}


