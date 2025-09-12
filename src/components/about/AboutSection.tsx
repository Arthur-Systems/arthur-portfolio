'use client';

import React, { useEffect, useRef } from 'react';
import AboutPhoto from './AboutPhoto';
import AboutHighlights from './AboutHighlights';
import AboutEmbeds from './AboutEmbeds';
import AboutLocation from './AboutLocation';
import { initAboutFx, killAboutFx } from '@/lib/aboutFx';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { initMetaFx, killMetaFx } from '../../lib/aboutMetaFx';

export const AboutSection: React.FC = () => {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (rootRef.current) {
      initAboutFx(rootRef.current);
      initMetaFx(rootRef.current);
    }
    return () => {
      killMetaFx();
      killAboutFx();
    };
  }, [reduced]);

  return (
    <section
      id="about"
      ref={rootRef as any}
      data-about-root
      className="relative isolate min-h-[80vh] w-full"
      aria-label="About Arthur Wei"
    >
      {/* Background vignette / texture to match hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -20%, rgba(19,78,74,0.18), transparent 60%), radial-gradient(120% 80% at 110% 110%, rgba(76,29,149,0.20), transparent 58%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: portrait */}
          <div className="max-w-md lg:max-w-none mx-auto w-full lg:col-span-5">
            <AboutPhoto />
          </div>

          {/* Right: copy */}
          <div className="text-left lg:col-span-7">
            <h2
              data-about-h2
              className="text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent font-sora"
            >
              About Arthur
            </h2>
            <div className="mt-2 h-px w-28 bg-gradient-to-r from-cyan-400/70 via-indigo-400/60 to-transparent" aria-hidden />
            <p className="mt-3 text-sm text-white/70 font-inter">
              Backend-focused Software Engineer — AI • Cloud • Real-time Systems
            </p>
            <p
              data-about-intro
              className="mt-5 font-inter text-[clamp(1rem,1.05vw,1.125rem)] leading-relaxed text-white/85 max-w-[65ch]"
            >
              Building scalable AI and cloud systems that empower human progress. I help teams deliver resilient, low-latency platforms—measured, observable, and maintainable—so companies can ship faster without trading off quality.
            </p>

            <div className="mt-8">
              <div
                className="rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400/25 via-indigo-500/20 to-fuchsia-500/25 shadow-xl shadow-black/25"
                data-hover-card
                data-about-goals
              >
                <div className="rounded-[1rem] bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 p-5">
                  <h3 className="text-white font-semibold">Goals</h3>
                  <ul className="mt-3 space-y-3 text-white/90 font-inter">
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300/90" aria-hidden />
                      <span>Scale AI systems responsibly for real products</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-300/90" aria-hidden />
                      <span>Push latency & reliability in distributed backends</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-fuchsia-300/90" aria-hidden />
                      <span>Build human-centered tools that make complex systems usable</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <AboutHighlights className="mt-8" />

            {/* Inline meta pills */}
            <div data-about-meta className="mt-6 flex flex-wrap gap-2 text-white/90">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:text-sm backdrop-blur-sm ring-1 ring-white/10">SF Bay Area</span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:text-sm backdrop-blur-sm ring-1 ring-white/10">AWS Certified (SAA-C03)</span>
            </div>

            {/* Selected impact placeholders */}
            <div className="mt-4 flex flex-wrap gap-2 text-white/90">
              {[
                '↓ p95 latency 38%',
                '↑ throughput 3.2×',
                '99.98% SLO (4Q trailing)',
              ].map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] sm:text-xs backdrop-blur-sm ring-1 ring-white/10"
                >
                  {m}
                </span>
              ))}
            </div>

          </div>
        </div>

        {/* Spotlight: Location (full-width subsection) */}
        <section
          data-about-block="location"
          className="mt-10 w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[radial-gradient(120%_100%_at_0%_0%,rgba(34,211,238,0.12),transparent_60%),radial-gradient(120%_100%_at_100%_100%,rgba(99,102,241,0.12),transparent_60%)]"
        >
          <div className="container mx-auto max-w-6xl px-6 py-10 md:py-14">
            <AboutLocation className="w-full" />
          </div>
        </section>

        {/* AWS skills (simple) */}
        <section
          data-about-block="aws"
          className="mt-10 w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10"
        >
          <div className="container mx-auto max-w-6xl px-6 py-10 md:py-14">
            <h3 className="text-white font-semibold">AWS skills</h3>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/85">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
                <span>Certified Solutions Architect — Associate (SAA‑C03)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
                <span>Designing resilient, cost‑optimized, secure architectures</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
                <span>Hands‑on: S3, Lambda, API Gateway, EC2, RDS, VPC</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
                <span>Observability and reliability (CloudWatch, X-Ray)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Extra: personal blurb */}
        <div data-about-extra className="mt-12 text-white/80 max-w-3xl">
          <p>
            Beyond systems and infrastructure, I care about teams and the craft. I like aligning product, platform, and people—so shipping ambitious systems stays humane and sustainable.
          </p>
        </div>

        {/* Hobbies */}
        <div data-about-hobbies className="mt-10">
          <h3 className="text-white font-semibold">Outside of work</h3>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/85">
            <li className="flex gap-3">
              <span aria-hidden>🏔️🚴</span>
              <span>Mountain biking — getting outside and exploring nature on two wheels.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden>📸🎥</span>
              <span>Photography and videography — professional gear; shot events across the U.S.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden>🌲</span>
              <span>Nature exploration — hiking, wandering, and just being out in scenic places.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden>🚁</span>
              <span>Drone photography — capturing aerial shots when possible.</span>
            </li>
          </ul>
        </div>

        {/* Embeds */}
        <AboutEmbeds className="mt-10" githubUsername="Arthur-Systems" />

      </div>
    </section>
  );
};

export default AboutSection;


