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
let awsTl: gsap.core.Timeline | null = null;
let storedOverlay: HTMLElement | null = null;
let storedAwsBlock: HTMLElement | null = null;
let storedLetters: HTMLElement[] = [];
let storedCertified: HTMLElement | null = null;
let storedCheckPath: SVGPathElement | null = null;
let hoverTargets: HTMLElement[] = [];
let preTrigger: ScrollTrigger | null = null;
let pinTriggerRef: ScrollTrigger | null = null;

export function initAboutBlocksFx(root: HTMLElement) {
  ctx = gsap.context(() => {
    const awsWrapper = root.querySelector('[data-aws-wrapper]') as HTMLElement | null;
    const awsStage = root.querySelector('[data-aws-stage]') as HTMLElement | null;
    const overlay = root.querySelector('[data-aws-overlay]') as HTMLElement | null;
    const logo = root.querySelector('[data-aws-logo]') as SVGElement | null;
    const certified = root.querySelector('[data-aws-certified]') as HTMLElement | null;
    const letters = certified ? (Array.from(certified.querySelectorAll('[data-letter]')) as HTMLElement[]) : [];
    const check = root.querySelector('[data-aws-check] path') as SVGPathElement | null;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!awsWrapper || !awsStage || !overlay) return;
    storedOverlay = overlay;
    storedAwsBlock = awsStage;
    storedLetters = letters;
    storedCertified = certified;
    storedCheckPath = check;

    // Initial states
    if (certified) gsap.set(certified, { opacity: 0, y: 8 });
    if (letters.length) gsap.set(letters, { opacity: 0, y: 8 });
    if (check) gsap.set(check, { strokeDasharray: 100, strokeDashoffset: 100 });
    // Ensure details are hidden under overlay at start
    const detailsEl = root.querySelector('[data-aws-details]') as HTMLElement | null;
    if (detailsEl) gsap.set(detailsEl, { opacity: 0 });
    // Overlay baseline and wipe baseline for stability
    try {
      gsap.set(overlay, { zIndex: 50, opacity: 1, backgroundColor: '#ffffff' });
      const wipeEl = root.querySelector('[data-aws-wipe]') as HTMLElement | null;
      if (wipeEl) gsap.set(wipeEl, { transformOrigin: '50% 0%', transform: 'scaleY(0)', willChange: 'transform', backfaceVisibility: 'hidden' });
    } catch {}

    // Helpers
    const wipe = root.querySelector('[data-aws-wipe]') as HTMLElement | null;
    const details = root.querySelector('[data-aws-details]') as HTMLElement | null;
    const mark = root.querySelector('[data-aws-mark]') as HTMLElement | null;

    // Measure logo height once (fallback to 120)
    let measuredLogoH = 0;
    const getLogoHeight = () => {
      if (!measuredLogoH) {
        try {
          const el = root.querySelector('[data-aws-logo]') as HTMLElement | null;
          if (el) measuredLogoH = Math.max(80, Math.round(el.getBoundingClientRect().height));
        } catch {}
      }
      return measuredLogoH || 120;
    };
    const setOverlayMode = (_fixed: boolean) => {
      if (!overlay) return;
      // Always keep overlay absolute inside the stage; do not switch to fixed
      overlay.style.position = 'absolute';
      overlay.style.inset = '0px';
    };

    // Phase A: pre-pin growth while approaching (no pin)
    const preRevealStart = 0.05; // 5% visible when stage enters viewport (near top)
    const preRevealEnd = 0.9;    // 90% revealed by the time pin begins
    preTrigger = ScrollTrigger.create({
      trigger: awsStage,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onEnter: () => setOverlayMode(true),
      onUpdate: (self) => {
        if (prefersReduced) return;
        const p = self.progress; // 0..1
        const reveal = preRevealStart + (preRevealEnd - preRevealStart) * p;
        if (wipe) {
          wipe.style.transformOrigin = '50% 0%';
          wipe.style.transform = `scaleY(${reveal})`;
        }
        // Attach the AWS mark to the moving front (bottom) of the white area,
        // then clamp to center once full height is reached.
        if (mark) {
          const overlayH = window.innerHeight;
          const centerY = overlayH / 2;
          const logoH = getLogoHeight();
          const frontY = reveal * overlayH; // moving bottom edge of white
          const marginTopPx = 14; // ensure a bit of space from the top edge
          // Anchor the logo's TOP to just below the front edge of white
          let y = frontY - logoH - marginTopPx;
          // Clamp: never closer than marginTopPx to the viewport top, and stop at center
          y = Math.max(marginTopPx, Math.min(y, centerY - logoH / 2));
          mark.style.top = `${Math.round(y)}px`;
        }
        // Keep overlay positioned via absolute inset-0
        setOverlayMode(false);
      },
      onLeave: () => setOverlayMode(true),
      onEnterBack: () => setOverlayMode(true),
    });

    // Phase B: pin and complete growth + sequence
    pinTriggerRef = ScrollTrigger.create({
      trigger: awsWrapper,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      pin: !prefersReduced ? awsStage : false,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => setOverlayMode(true),
      onUpdate: (self) => {
        if (prefersReduced) return;
        const p = self.progress; // 0..1
        // Continue wipe from preRevealEnd -> 100%
        const phase = Math.max(0, Math.min(p / 0.2, 1));
        const reveal = preRevealEnd + (1 - preRevealEnd) * phase; // 0.9 -> 1.0
        if (wipe) {
          wipe.style.transformOrigin = '50% 0%';
          wipe.style.transform = `scaleY(${reveal})`;
        }
        // Continue mark motion attached to front, clamped to center
        if (mark) {
          const overlayH = window.innerHeight;
          const centerY = overlayH / 2;
          const logoH = getLogoHeight();
          const frontY = reveal * overlayH;
          const marginTopPx = 14;
          let y = frontY - logoH - marginTopPx;
          y = Math.max(marginTopPx, Math.min(y, centerY - logoH / 2));
          mark.style.top = `${Math.round(y)}px`;
        }
        // Keep overlay fully present at all times, absolute inside stage
        if (overlay) overlay.style.opacity = '1';
        setOverlayMode(false);
        // Keep details hidden; we only showcase the AWS logo for now
        if (details) details.style.opacity = '0';
      },
      onLeave: () => {
        // Keep overlay mode consistent; release after pin naturally ends
        setOverlayMode(false);
      },
      onEnterBack: () => {
        // Ensure overlay visible on re-enter
        if (overlay) overlay.style.opacity = '1';
        setOverlayMode(true);
      },
    });

    // Hover micro for AWS section heading/container (re-use meta hover targets)
    hoverTargets = Array.from(awsStage.querySelectorAll('[data-meta-hover]')) as HTMLElement[];
    setupHover(hoverTargets);
  }, root);
}

// Debug overlay helper
function updateDebug(el: HTMLElement, progress?: number) {
  try {
    const wrap = document.querySelector('[data-aws-wrapper]') as HTMLElement | null;
    const stage = document.querySelector('[data-aws-stage]') as HTMLElement | null;
    if (!wrap || !stage) return;
    const wr = wrap.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    el.textContent = `AWS Debug — progress: ${(progress ?? 0).toFixed(3)} | wrap(top:${wr.top.toFixed(1)},h:${wr.height.toFixed(1)}) stage(top:${sr.top.toFixed(1)},h:${sr.height.toFixed(1)})`;
  } catch {}
}

function setupHover(targets: HTMLElement[]) {
  const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  targets.forEach((el) => {
    let hover = false;
    let raf: number | null = null;
    let lastShineAt = 0;
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
      const tz = 8;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(async () => {
        const anime = await getAnime();
        if (!anime) return;
        el.style.willChange = 'transform';
        try { (anime as any)?.remove?.(el); } catch {}
        anime({ targets: el, rotateX: rx, rotateY: ry, translateZ: tz, duration: 140, easing: 'easeOutQuad' });
      });
    };
    const onEnter = async () => {
      hover = true;
      const anime = await getAnime();
      if (!anime) return;
      const shine = el.querySelector('[data-shine]') as HTMLElement | null;
      const now = Date.now();
      if (shine && now - lastShineAt > 700) {
        lastShineAt = now;
        shine.style.opacity = '1';
        try { (anime as any)?.remove?.(shine); } catch {}
        anime({ targets: shine, translateX: ['-120%', '120%'], duration: 650, easing: 'easeOutCubic', complete: () => {
          if (shine) { shine.style.opacity = '0'; shine.style.transform = 'translateX(-120%)'; }
        }});
      }
    };
    const onLeave = async () => {
      hover = false;
      if (raf) cancelAnimationFrame(raf);
      const anime = await getAnime();
      if (!anime) return;
      try { (anime as any)?.remove?.(el); } catch {}
      anime({ targets: el, rotateX: 0, rotateY: 0, translateZ: 0, duration: 200, easing: 'easeOutQuad', complete: () => { el.style.willChange = ''; } });
    };
    el.addEventListener('pointermove', onMove as any);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);
    el.addEventListener('touchend', onLeave, { passive: true });
    (el as any).__aboutBlocksHover = { onMove, onEnter, onLeave } as const;
  });
}

export function killAboutBlocksFx() {
  try { awsTl?.kill(); } catch {}
  awsTl = null;
  try { preTrigger?.kill(); } catch {}
  preTrigger = null;
  try { pinTriggerRef?.kill(); } catch {}
  pinTriggerRef = null;
  // Remove hover listeners and anime transforms
  hoverTargets.forEach((el) => {
    const h = (el as any).__aboutBlocksHover as
      | { onMove: (e: PointerEvent) => void; onEnter: () => void; onLeave: () => void }
      | undefined;
    if (h) {
      el.removeEventListener('pointermove', h.onMove as any);
      el.removeEventListener('pointerenter', h.onEnter);
      el.removeEventListener('pointerleave', h.onLeave);
      el.removeEventListener('pointercancel', h.onLeave);
      el.removeEventListener('touchend', h.onLeave as any);
      delete (el as any).__aboutBlocksHover;
    }
    // Clear inline transform styles set during hover
    el.style.willChange = '';
    el.style.transform = '';
  });
  hoverTargets = [];
  // Clear inline styles set during scroll updates
  if (storedOverlay) storedOverlay.style.opacity = '';
  if (storedCertified) { storedCertified.style.opacity = ''; storedCertified.style.transform = ''; }
  if (storedLetters.length) storedLetters.forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
  if (storedCheckPath) { storedCheckPath.style.strokeDasharray = ''; storedCheckPath.style.strokeDashoffset = ''; }
  storedOverlay = null;
  storedCertified = null;
  storedLetters = [];
  storedCheckPath = null;
  if (ctx) {
    try { ctx.revert(); } catch {}
    ctx = null;
  }
}


