'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapTimelines';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUIReady } from '@/hooks/useUIReady';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const { setStep } = useUIReady();

  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !subtitleRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([titleRef.current, subtitleRef.current], { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(titleRef.current, { opacity: 0, y: 40, duration: 0.8 })
        .from(subtitleRef.current, { opacity: 0, y: 24, duration: 0.6 }, '-=0.3');
      setStep('Hero animated');
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, setStep]);

  return (
    <section ref={containerRef} className="relative min-h-[60vh] flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold text-foreground">Welcome</h1>
        <p ref={subtitleRef} className="mt-4 text-xl md:text-2xl text-muted-foreground">Minimal hero example</p>
      </div>
    </section>
  );
}






