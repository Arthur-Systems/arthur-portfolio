'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapTimelines';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { ScrollIndicator } from './ScrollIndicator';
import { useUIReady } from '@/hooks/useUIReady';
import { Loader } from '@/state/loaderBus';
import HeroCover from './HeroCover';

export default function EngineerHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const missionRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const [hydrated, setHydrated] = useState(false);

  const reducedMotion = useReducedMotion();
  const { isLowPerformance } = usePerformanceMonitor();
  const { setStep } = useUIReady();

  useEffect(() => {
    // Avoid content flash until hydration completes
    setHydrated(true);

    if (
      !containerRef.current ||
      !nameRef.current ||
      !taglineRef.current ||
      !missionRef.current ||
      !metaRef.current ||
      !ctaRef.current ||
      !bgRef.current
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!reducedMotion && !isLowPerformance) {
        const tl = gsap.timeline({ delay: 0.2 });

        // Location Tag — fade in + slight upward float
        tl.from(locationRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        })
          // Name — scale up from 0.95 with ease-out + fade
          .from(
            nameRef.current,
            {
              opacity: 0,
              scale: 0.95,
              duration: 0.9,
              ease: 'power3.out',
              transformOrigin: '50% 60%',
            },
            '+=0.15'
          )
          // Tagline — fade in from below with gentle slide
          .from(
            taglineRef.current,
            {
              opacity: 0,
              y: 30,
              duration: 0.7,
              ease: 'power3.out',
            },
            '+=0.2'
          )
          // Mission — slower fade for emphasis
          .from(
            missionRef.current,
            {
              opacity: 0,
              duration: 0.9,
              ease: 'expo.out',
            },
            '+=0.2'
          )
          // Skill Pills — stagger left→right slide & fade
          .from(
            Array.from(metaRef.current!.children) as HTMLElement[],
            {
              opacity: 0,
              x: -30,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.2,
            },
            '+=0.15'
          )
          // CTA buttons — subtle rise
          .from(
            Array.from(ctaRef.current!.children) as HTMLElement[],
            {
              opacity: 0,
              y: 16,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.12,
            },
            '+=0.15'
          );
        setStep('Animating hero…');
        Loader.step(10, 'Hero animation…');

        // Parallax drift for background gradient
        gsap.to(bgRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      } else {
        gsap.set(
          [
            nameRef.current,
            taglineRef.current,
            missionRef.current,
            ...Array.from(metaRef.current!.children) as HTMLElement[],
            ...Array.from(ctaRef.current!.children) as HTMLElement[],
          ],
          { opacity: 1, y: 0 }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      // Make sure ScrollTrigger recalculates after hero unmount
      try { ScrollTrigger.refresh(); } catch {}
    };
  }, [reducedMotion, isLowPerformance]);

  // Remove anime.js micro-interactions to keep initial load animations only

  // Reset background lines to solid and neutral position
  useEffect(() => {
    const svg = linesRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll('path')) as SVGPathElement[];
    const groups = Array.from(svg.querySelectorAll('g')) as SVGGElement[];
    paths.forEach(p => {
      try {
        p.style.strokeDasharray = 'none';
        p.style.strokeDashoffset = '0';
      } catch {}
    });
    groups.forEach(g => {
      try {
        (g as any).style.transform = '';
      } catch {}
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-black transition-opacity duration-300 ${hydrated ? 'opacity-100' : 'opacity-0'}`}
      role="region"
      aria-label="Hero section"
    >
      {/* Background gradient (Three.js visuals removed) */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(25, 162, 255, 0.28) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.28) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(45, 212, 191, 0.18) 0%, transparent 50%),
              linear-gradient(135deg, #0b1220 0%, #000000 55%, #0b1220 100%)
            `,
          }}
        />
        {/* Three.js scene removed */}
        {/* Faint AI/network line motif */}
        <svg
          data-hero-lines
          ref={linesRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
        >
          <g fill="none" stroke="rgba(93, 188, 252, 0.14)" strokeWidth="1.2">
            <path d="M-20,520 C180,420 320,480 520,420 C720,360 860,380 1040,300" />
            <path d="M-20,420 C200,340 340,360 540,320 C740,280 900,280 1040,240" />
            <path d="M-20,340 C160,300 320,280 520,260 C740,240 920,220 1040,200" />
          </g>
          <g fill="none" stroke="rgba(168, 85, 247, 0.12)" strokeWidth="1">
            <path d="M-20,560 C120,520 260,540 420,500 C600,450 760,460 1040,420" />
            <path d="M-20,300 C120,280 300,240 520,220 C760,200 920,180 1040,140" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center">
        <div
          ref={locationRef}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 mb-5"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.85)]" />
          SF Bay Area • UC Santa Cruz CS
        </div>

        <h1
          ref={nameRef}
          className="font-space-grotesk text-white tracking-tight leading-[0.95]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)', fontWeight: 700 }}
        >
          Arthur Wei
        </h1>

        <p
          ref={taglineRef}
          className="mt-4 text-lg sm:text-2xl text-white/80 font-light"
        >
          Backend‑focused Software Engineer — AI • Cloud • Real‑time Systems
        </p>

        <p
          ref={missionRef}
          className="mt-3 text-base sm:text-lg text-white/60 max-w-2xl mx-auto"
        >
          Building scalable AI and cloud systems that empower human progress.
        </p>

        {/* Brand motif bullets */}
        <div ref={metaRef} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-white/60">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> AI pipelines & computer vision
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> High‑performance & distributed systems
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> Human‑centered innovation
          </div>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/tech"
            className="group px-7 py-3 rounded-full bg-white/10 border border-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/25"
          >
            <span className="inline-flex items-center gap-2">
              View My Work
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
          <a
            href="mailto:arthur@example.com"
            className="group px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:shadow-cyan-500/20 hover:from-cyan-400 hover:to-violet-500"
          >
            <span className="inline-flex items-center gap-2">
              Contact Me
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Scroll-synced cover blocks pinned to hero */}
      <HeroCover targetRef={containerRef} blocks={7} />

      {/* Scroll Indicator */}
      <ScrollIndicator ref={indicatorRef as any} />

      {/* SR-only description */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Hero section introducing Arthur Wei, backend-focused software engineer in the SF Bay Area with expertise in AI, cloud, and real-time systems.
      </div>
    </section>
  );
}


