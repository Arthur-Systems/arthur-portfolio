'use client';

import React, { useEffect, useRef, useState } from 'react';
import HeroBackground from '@/components/hero/HeroBackground';
import HeroGhost from '@/components/hero/HeroGhost';
import HeroChips from '@/components/hero/HeroChips';
import { initHeroFx, killHeroFx } from '@/lib/heroFx';
import { ScrollIndicator } from '@/components/hero/ScrollIndicator';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { GraduationCap, Mail, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setHydrated(true);
    if (rootRef.current) initHeroFx(rootRef.current);
    return () => killHeroFx();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className={`relative min-h-[100svh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden isolate transition-opacity duration-300 ${hydrated ? 'opacity-100' : 'opacity-0'}`}
      aria-label="Hero section"
    >
      <HeroBackground />

      {/* Top utility row */}
      <div className="absolute top-0 inset-x-0">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-center sm:justify-between py-4">
            {/* Left: placeholder to preserve centered nav alignment */}
            <div className="hidden sm:flex items-center">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm text-xs sm:text-sm text-white/85 invisible"
                aria-hidden="true"
              >
                <GraduationCap className="h-4 w-4 text-emerald-300/90" />
                Master of Computer Science at UCI
              </span>
            </div>
            {/* Center: nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#Location" className="hover:text-white transition-colors">Location</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <a href="/resume.pdf" className="hover:text-white transition-colors">Resume</a>
            </nav>
            {/* Right: role pill */}
            <div className="flex items-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md text-xs sm:text-sm text-white/90 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/15">
                <GraduationCap className="h-4 w-4 text-emerald-300/90" />
                Master of Computer Science @ UCI
              </span>
            </div>
          </div>
          <div className="h-px bg-white/5" />
        </div>
      </div>

      {/* Headline block */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        {/* Ghost line positioned above the H1 */}
        <HeroGhost data-hero-row="0" className="text-[clamp(3rem,8vw,6rem)] font-black uppercase tracking-[-0.04em]" />
        <div className="relative inline-block">
          <h1
            data-hero-row="1"
            data-hero-headline
            className="relative z-10 font-space-grotesk text-white tracking-tight leading-[0.95]"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', fontWeight: 800 }}
          >
            Arthur Wei
          </h1>
        </div>
        <h2 className="mt-4 text-lg sm:text-2xl text-white/85 font-medium" data-hero-tagline data-hero-row="2">
          Backend-focused Software Engineer — AI • Cloud • Real-time Systems
        </h2>
        <p className="mt-3 text-base sm:text-lg text-white/70 max-w-2xl mx-auto" data-hero-body data-hero-row="3">
          Building scalable AI and cloud systems that empower human progress.
        </p>
        <div className="mt-6" data-hero-chips data-hero-row="4">
          <HeroChips />
        </div>
        <div className="mt-10" data-hero-cta data-hero-row="5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="/tech"
              className="px-6 sm:px-7 py-3 rounded-full bg-white/10 border border-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/25 inline-flex items-center gap-2"
              data-interactive
            >
              <span>View Work</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:arthur@example.com"
              className="px-6 sm:px-7 py-3 rounded-full border border-white/20 text-white/90 hover:text-white hover:border-white/40 transition-all duration-300 inline-flex items-center gap-2"
              data-interactive
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Contact Me</span>
            </a>
          </div>
          {/* Removed bottom chips (SF Bay Area, AWS Certified) per request */}
        </div>
      </div>

      {/* Scroll down indicator - positioned above bottom navbar */}
      <ScrollIndicator />
    </section>
  );
};