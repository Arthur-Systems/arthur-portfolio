'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapTimelines';
import { TechTimeline } from '@/components/layout/TechTimeline';

export default function TechPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current && subtitleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });
    }

    requestAnimationFrame(() => {
      try { (ScrollTrigger as any).refresh?.(); } catch {}
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section
        ref={heroRef}
        className="min-h-[50vh] flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background/20" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold text-foreground mb-4"
          >
            Technology
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground font-light"
          >
            Building innovative solutions with cutting-edge tools
          </p>
        </div>
      </section>

      <TechTimeline />
    </div>
  );
}