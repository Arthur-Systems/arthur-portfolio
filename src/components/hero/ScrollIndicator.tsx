'use client';

import { useRef, useEffect, forwardRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator = forwardRef<HTMLDivElement, ScrollIndicatorProps>(({ className = '' }, ref) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  // Forward ref
  useEffect(() => {
    if (ref && indicatorRef.current) {
      if (typeof ref === 'function') {
        ref(indicatorRef.current);
      } else {
        ref.current = indicatorRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (!indicatorRef.current || !arrowRef.current) return;

    const appearDur = reduced ? 0.12 : 1.0;
    const arrowDur = reduced ? 0.12 : 1.5;

    const appear = gsap.fromTo(
      indicatorRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: appearDur, ease: 'power2.out', delay: 1.2 }
    );

    const pulseTween = reduced
      ? null
      : gsap.to(arrowRef.current, {
          y: 8,
          duration: arrowDur,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: 1.6,
        });

    return () => {
      try { appear.kill(); } catch {}
      try { pulseTween?.kill(); } catch {}
    };
  }, [reduced]);

  // Fade out indicator once user scrolls past a small threshold
  useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;
    let hidden = false;
    const threshold = Math.max(60, window.innerHeight * 0.25);
    const onScroll = () => {
      const shouldHide = window.scrollY > threshold;
      if (shouldHide === hidden) return;
      hidden = shouldHide;
      gsap.to(el, {
        opacity: shouldHide ? 0 : 1,
        duration: reduced ? 0.08 : 0.3,
        ease: 'power1.out',
        onComplete: () => {
          if (!indicatorRef.current) return;
          indicatorRef.current.style.pointerEvents = shouldHide ? 'none' : 'auto';
        },
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize state on mount in case page loads mid-scroll
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  const handleClick = () => {
    // Scroll to About section offset by any fixed bottom nav
    const about = document.getElementById('about');
    const fixedNav = document.querySelector('[data-fixed-nav]') as HTMLElement | null;
    if (!about) return;
    const rect = about.getBoundingClientRect();
    const offsetTop = window.scrollY + rect.top;
    const navOverlap = fixedNav ? fixedNav.getBoundingClientRect().height + 24 /* bottom spacing */ : 0;
    const target = Math.max(0, offsetTop - navOverlap);
    try {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, target);
    }
  };

  return (
    <div
      ref={indicatorRef}
      className={`absolute left-1/2 transform -translate-x-1/2 z-20 cursor-pointer ${className}`}
      style={{
        bottom: 'calc(2rem + var(--nav-bottom-safe, 0px))',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Scroll down"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <svg
        ref={arrowRef}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white/70 hover:text-white transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
      >
        <path
          d="M7 10l5 5 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';