'use client';

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let ctx: gsap.Context | null = null;
let enterTl: gsap.core.Timeline | null = null;
let microFx: { teardown: () => void } | null = null;
let currentRoot: HTMLElement | null = null;
// Store card tilt handlers per gsap context to clean up reliably
const ctxToCardHandlers = new WeakMap<
  gsap.Context,
  Array<{ el: HTMLElement; move: (e: PointerEvent) => void; leave: () => void }>
>();

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

export function initAboutFx(root: HTMLElement) {
  if (!root) return;
  currentRoot = root;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ctx = gsap.context(() => {
    const photo = root.querySelector('[data-about-photo]') as HTMLElement | null;
    const h2 = root.querySelector('[data-about-h2]') as HTMLElement | null;
    const body = root.querySelector('[data-about-intro]') as HTMLElement | null;
    const goals = root.querySelector('[data-about-goals]') as HTMLElement | null;
    const chips = root.querySelector('[data-about-chips]') as HTMLElement | null;
    const meta = root.querySelector('[data-about-meta]') as HTMLElement | null;
    const location = root.querySelector('[data-about-location]') as HTMLElement | null;
    const cert = root.querySelector('[data-about-cert]') as HTMLElement | null;
    const extra = root.querySelector('[data-about-extra]') as HTMLElement | null;
    const hobbies = root.querySelector('[data-about-hobbies]') as HTMLElement | null;
    const embeds = root.querySelector('[data-about-embeds]') as HTMLElement | null;
    const hoverCards = Array.from(root.querySelectorAll('[data-hover-card]')) as HTMLElement[];

    // initial states
    gsap.set(root, { opacity: 0, y: 24 });
    if (photo) gsap.set(photo, { opacity: 0, x: -12, y: 24, rotateX: -6, rotateY: 10, scale: 0.98, transformPerspective: 1000 });
    [h2, body, goals, chips, meta, location, cert, extra, hobbies, embeds].forEach((el) => el && gsap.set(el, { opacity: 0, y: 16 }));
    // cards slight tilt (exclude stable sections like embeds/music)
    [goals, location, cert].forEach((el) => el && gsap.set(el, { rotateX: -3, rotateY: 6, transformPerspective: 1000 }));
    if (chips) {
      const items = Array.from(chips.children) as HTMLElement[];
      gsap.set(items, { opacity: 0, y: 12 });
    }

    const startPlay = () => {
      // reduced motion: faster, minimal
      const ease = prefersReduced ? 'power1.out' : 'power3.out';

      enterTl = gsap.timeline({ defaults: { ease } });
      // Section raise
      enterTl.to(root, { opacity: 1, y: 0, duration: prefersReduced ? 0.12 : 0.4 }, 0);

      // 1) Photo: slide in with 3D tilt easing towards base
      if (photo) {
        enterTl.to(
          photo,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotateX: -2,
            rotateY: 4,
            scale: 1,
            duration: prefersReduced ? 0.12 : 0.6,
            ease: 'power2.inOut',
          },
          0.02
        );
      }

      // 2) Heading then intro
      const copyEls = [h2, body].filter(Boolean) as HTMLElement[];
      if (copyEls.length) enterTl.to(copyEls, { opacity: 1, y: 0, duration: prefersReduced ? 0.12 : 0.5, stagger: prefersReduced ? 0.02 : 0.08 }, 0.18);

      // 3) Goals + chips group with tilt settling
      const group1 = [goals, chips].filter(Boolean) as HTMLElement[];
      if (group1.length) enterTl.to(group1, { opacity: 1, y: 0, duration: prefersReduced ? 0.12 : 0.5, stagger: prefersReduced ? 0.02 : 0.06 }, '>-0.12');
      if (goals) enterTl.to(goals, { rotateX: 0, rotateY: 0, duration: prefersReduced ? 0.12 : 0.5, ease: 'power2.inOut' }, '<');
      if (chips) {
        const items = Array.from(chips.children) as HTMLElement[];
        if (items.length) enterTl.to(items, { opacity: 1, y: 0, duration: prefersReduced ? 0.12 : 0.45, stagger: prefersReduced ? 0.02 : 0.06 }, '<+0.02');
      }

      // 4) Meta then spotlight cards (location + cert), then embeds; embeds keep tiny residual rotateY
      const spotlightBlocks = [location, cert].filter(Boolean) as HTMLElement[];
      const laterBlocks = [meta, ...spotlightBlocks, embeds].filter(Boolean) as HTMLElement[];
      if (laterBlocks.length) enterTl.to(laterBlocks, { opacity: 1, y: 0, duration: prefersReduced ? 0.12 : 0.45, stagger: prefersReduced ? 0.02 : 0.08 }, '>-0.06');
      if (spotlightBlocks.length && !prefersReduced) enterTl.to(spotlightBlocks, { rotateX: 0, rotateY: 0, duration: prefersReduced ? 0.12 : 0.45, ease: 'power2.inOut', stagger: 0.04 }, '<');
      if (embeds && !prefersReduced && !embeds.hasAttribute('data-stable')) enterTl.to(embeds, { rotateY: 2, duration: 0.4, ease: 'power2.inOut' }, '<');

      // trailing extras if present
      const trailing = [extra, hobbies].filter(Boolean) as HTMLElement[];
      if (trailing.length) enterTl.to(trailing, { opacity: 1, y: 0, duration: prefersReduced ? 0.12 : 0.4, stagger: prefersReduced ? 0.02 : 0.06 }, '>-0.04');

      enterTl.eventCallback('onComplete', () => {
        if (!prefersReduced) {
          getAnime().then((loaded) => {
            if (loaded) microFx = setupMicroFx(photo);
          });
          // Light tilt for all hover cards
          const filteredHoverCards = hoverCards.filter((el) => !el.hasAttribute('data-no-tilt'));
          const handlers = setupCardTilts(filteredHoverCards);
          if (ctx) ctxToCardHandlers.set(ctx, handlers);
        }
      });
    };

    ScrollTrigger.create({
      trigger: root,
      start: 'top 75%',
      once: true,
      onEnter: startPlay,
    });
  }, root);
}

function setupMicroFx(photoEl: HTMLElement | null) {
  if (!photoEl) return { teardown: () => {} };
  const shine = photoEl.querySelector('[data-shine]') as HTMLElement | null;
  let hover = false;
  const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let idleInstance: AnimeInstanceLite | null = null;
  let lastShineAt = 0;

  const startIdle = () => {
    if (!_anime || typeof _anime !== 'function') return;
    if (idleInstance) return;
    try { ( _anime as any )?.remove?.(photoEl); } catch {}
    idleInstance = _anime({
      targets: photoEl,
      rotateX: [{ value: -2 }, { value: -1 }],
      rotateY: [{ value: 4 }, { value: 3 }],
      translateY: [{ value: -2 }, { value: 2 }],
      duration: 1800,
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true,
      autoplay: true,
    });
  };

  const stopIdle = () => {
    try { idleInstance?.pause?.(); } catch {}
    idleInstance = null;
  };

  // pointer parallax (translate/rotate)
  const onMove = (e: PointerEvent) => {
    if (!hover || !hasFinePointer) return;
    const rect = photoEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const factor = isMobile ? 0.6 : 1;
    const maxT = 8 * factor; // px
    const maxRX = 6 * factor; // deg
    const maxRY = 10 * factor; // deg
    const tx = Math.max(Math.min(dx * maxT, maxT), -maxT);
    const ty = Math.max(Math.min(dy * maxT, maxT), -maxT);
    const rx = Math.max(Math.min(-dy * maxRX, maxRX), -maxRX);
    const ry = Math.max(Math.min(dx * maxRY, maxRY), -maxRY);

    if (!_anime || typeof _anime !== 'function') return;
    try { ( _anime as any )?.remove?.(photoEl); } catch {}
    _anime({
      targets: photoEl,
      translateX: tx,
      translateY: ty,
      rotateX: rx,
      rotateY: ry,
      duration: 260,
      easing: 'easeOutCubic',
    });
  };

  const onEnter = () => {
    hover = true;
    stopIdle();
    if (shine && _anime && typeof _anime === 'function') {
      const now = Date.now();
      if (now - lastShineAt < 1200) return; // debounce
      lastShineAt = now;
      shine.style.opacity = '1';
      try { ( _anime as any )?.remove?.(shine); } catch {}
      _anime({
        targets: shine,
        translateX: ['-120%', '120%'],
        duration: 950,
        easing: 'easeOutCubic',
        complete: () => {
          if (shine) shine.style.opacity = '0';
          if (shine) shine.style.transform = 'translateX(-120%)';
        },
      });
    }
  };

  const onLeave = () => {
    hover = false;
    if (!_anime || typeof _anime !== 'function') return;
    try { ( _anime as any )?.remove?.(photoEl); } catch {}
    _anime({
      targets: photoEl,
      translateX: 0,
      translateY: 0,
      rotateX: -2,
      rotateY: 4,
      duration: 340,
      easing: 'easeOutCubic',
      complete: () => {
        // Resume idle after settling
        startIdle();
      },
    });
  };

  const onPointerMove = (e: Event) => onMove(e as PointerEvent);
  const onPointerEnter = () => onEnter();
  const onPointerLeave = () => onLeave();

  photoEl.addEventListener('pointermove', onPointerMove);
  photoEl.addEventListener('pointerenter', onPointerEnter);
  photoEl.addEventListener('pointerleave', onPointerLeave);

  // Start idle tilt immediately
  startIdle();

  return {
    teardown: () => {
      photoEl.removeEventListener('pointermove', onPointerMove);
      photoEl.removeEventListener('pointerenter', onPointerEnter);
      photoEl.removeEventListener('pointerleave', onPointerLeave);
      stopIdle();
    },
  };
}

function setupCardTilts(cards: HTMLElement[]) {
  const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFinePointer) return [] as Array<{ el: HTMLElement; move: (e: PointerEvent) => void; leave: () => void }>;
  const handlers: Array<{ el: HTMLElement; move: (e: PointerEvent) => void; leave: () => void }> = [];
  cards.forEach((el) => {
    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const maxT = 6;
      const maxR = 2;
      const tx = Math.max(Math.min(dx * maxT, maxT), -maxT);
      const ty = Math.max(Math.min(dy * maxT, maxT), -maxT);
      const rx = Math.max(Math.min(-dy * maxR, maxR), -maxR);
      const ry = Math.max(Math.min(dx * maxR, maxR), -maxR);
      gsap.to(el, { x: tx, y: ty, rotateX: rx, rotateY: ry, duration: 0.24, ease: 'power2.out' });
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    handlers.push({ el, move, leave });
  });

  return handlers;
}

export function killAboutFx() {
  try { enterTl?.kill(); } catch {}
  enterTl = null;
  try { microFx?.teardown(); } catch {}
  microFx = null;
  // Clear anime.js transforms/inline styles on our elements
  if (currentRoot) {
    try {
      const photo = currentRoot.querySelector('[data-about-photo]') as HTMLElement | null;
      const shine = currentRoot.querySelector('[data-shine]') as HTMLElement | null;
      if (photo) gsap.set(photo, { clearProps: 'transform,opacity' });
      if (shine) gsap.set(shine, { clearProps: 'transform,opacity' });
    } catch {}
  }

  if (ctx) {
    // cleanup hover card handlers
    try {
      const handlers = ctxToCardHandlers.get(ctx);
      handlers?.forEach(({ el, move, leave }) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
      ctxToCardHandlers.delete(ctx);
    } catch {}
    try { ctx.revert(); } catch {}
    ctx = null;
  }
  currentRoot = null;
}


