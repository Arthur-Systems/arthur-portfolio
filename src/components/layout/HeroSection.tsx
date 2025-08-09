'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
// AppleScene (R3F) removed — replace with decorative SVG gradient only

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !scrollIndicatorRef.current) return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Animate title
    gsap.from(titleRef.current, {
      opacity: 0,
      y: 50,
      scale: 0.8,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.5,
    });

    // Animate subtitle
    gsap.from(subtitleRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 1.5,
    });

    // Animate scroll indicator
    gsap.from(scrollIndicatorRef.current, {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: 'power2.out',
      delay: 2,
    });

    // Bounce animation for scroll indicator
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 2.5,
    });

    // Parallax effect on scroll
    gsap.to(heroRef.current, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Decorative background (DOM/SVG only) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <radialGradient id="g1" cx="20%" cy="80%" r="60%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </radialGradient>
            <radialGradient id="g2" cx="80%" cy="20%" r="55%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.32)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0)" />
            </radialGradient>
          </defs>
          <rect width="1200" height="800" fill="url(#g1)" />
          <rect width="1200" height="800" fill="url(#g2)" />
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-foreground mb-6"
        >
          Arthur Wei
        </h1>
        
        <h2
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light tracking-wide"
        >
          Engineer • Photographer • Storyteller
        </h2>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background/80 z-15" />
    </section>
  );
};