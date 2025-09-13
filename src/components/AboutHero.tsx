'use client';

/**
 * AboutHero
 *
 * A modern, responsive hero for the "About Arthur" section with:
 * - 12-column grid (mobile-first, swaps order on desktop)
 * - Glass cards and subtle depth
 * - Framer Motion entrance animations (respects reduced motion)
 * - Lucide-react icons
 * - Accessible structure and focus-visible states
 * - Background: subtle gradient blobs + ultra-light masked grid
 *
 * Package reminder:
 *   npm i framer-motion lucide-react
 *
 * Minimal usage:
 *
 *   import AboutHero from '@/components/AboutHero';
 *   export default function Page() {
 *     return (
 *       <AboutHero
 *         imageSrc="/images/profile.webp"
 *         imageAlt="Portrait of Arthur"
 *         onPrimaryCtaHref="#contact"
 *         onSecondaryCtaHref="#resume"
 *       />
 *     );
 *   }
 *
 * Next.js Image example:
 * (Uncomment inside the <div data-photo> to use next/image)
 *
 *   import Image from 'next/image';
 *   <Image
 *     src={imageSrc}
 *     alt={imageAlt}
 *     fill
 *     sizes="(min-width: 1024px) 480px, 100vw"
 *     priority
 *     className="object-cover"
 *   />
 */

import React from 'react';
import { motion, useReducedMotion, cubicBezier } from 'framer-motion';
import {
  CheckCircle2,
  Gauge,
  UsersRound,
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export type AboutHeroProps = {
  imageSrc?: string;
  imageAlt?: string;
  onPrimaryCtaHref?: string; // #contact by default
  onSecondaryCtaHref?: string; // #resume by default
  showCtas?: boolean; // default true
};

const DEFAULT_IMAGE_SRC = '/images/profile.webp';
const DEFAULT_IMAGE_ALT = 'Portrait of Arthur';

const goals = [
  {
    icon: Gauge,
    label: 'Scale AI systems responsibly for real products',
  },
  {
    icon: Sparkles,
    label: 'Push latency & reliability in distributed backends',
  },
  {
    icon: UsersRound,
    label: 'Build human-centered tools that make complex systems usable',
  },
];

const chips = [
  'AI pipelines & computer vision',
  'High-performance & distributed systems',
  'Secure, reliable backends',
  'Human-centered innovation',
];

function classNames(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const baseEase = cubicBezier(0.22, 1, 0.36, 1);

const fadeUp = (index = 0, distance = 12) => ({
  hidden: { opacity: 0, y: distance },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.06 * index, ease: baseEase },
  },
});

const fadeIn = (index = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.08 * index, ease: baseEase },
  },
});

const AboutHero: React.FC<AboutHeroProps> = ({
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = DEFAULT_IMAGE_ALT,
  onPrimaryCtaHref = '#contact',
  onSecondaryCtaHref = '/resume.pdf',
  showCtas = true,
}) => {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-arthur-title"
      className="relative isolate overflow-hidden bg-[#0B0D12] text-white"
    >
      {/* Background decor: gradient blobs + ultra-light grid masked to center */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Top-right blob */}
        <div
          className="absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl opacity-[0.20]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0.0) 70%)',
          }}
        />
        {/* Bottom-left blob */}
        <div
          className="absolute -bottom-24 left-[-10%] h-[460px] w-[460px] rounded-full blur-3xl opacity-[0.18]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,0.6) 0%, rgba(34,211,238,0.0) 70%)',
          }}
        />
        {/* Ultra-light grid with radial mask */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 24px)',
            WebkitMaskImage:
              'radial-gradient(110% 70% at 50% 40%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.0) 100%)',
            maskImage:
              'radial-gradient(110% 70% at 50% 40%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.0) 100%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* 12-col grid; swap order on desktop */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Copy column */}
          <motion.div
            initial={prefersReduced ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={fadeUp(0)}
            className="order-1 col-span-12 lg:order-1 lg:col-span-7"
          >
            {/* Eyebrow pill */}
            <motion.div
              variants={fadeIn(0)}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:text-sm text-white/85 backdrop-blur-sm"
            >
              Backend-focused Software Engineer — AI • Cloud • Real-time Systems
            </motion.div>

            {/* H1 */}
            <motion.h1
              id="about-arthur-title"
              variants={fadeUp(1, 10)}
              className="mt-3 font-sora text-4xl sm:text-5xl font-extrabold tracking-tight"
            >
              About Me
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              variants={fadeUp(2, 10)}
              className="mt-4 max-w-[65ch] font-inter text-base sm:text-lg leading-relaxed text-white/85"
            >
              I build end to end AI and cloud platforms that are resilient, low latency, observable, and easy to maintain, so teams can move quickly without giving up quality.
            </motion.p>

            {/* Skill chips */}
            <motion.div
              variants={fadeUp(3, 10)}
              className="mt-6 flex flex-wrap gap-2"
              aria-label="Key skills"
            >
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] sm:text-xs text-white/85 backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            {/* Goals card */}
            <motion.div
              variants={fadeUp(4, 12)}
              className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              data-hover-card
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <ShieldCheck className="h-4 w-4 text-cyan-300" aria-hidden />
                Goals
              </div>
              <ul className="mt-4 space-y-3 text-white/90 font-inter">
                {goals.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 text-indigo-300" aria-hidden />
                    <span className="text-[15px] leading-relaxed">{label}</span>
                  </li>
                ))}
              </ul>

              {showCtas && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={onPrimaryCtaHref}
                    className={classNames(
                      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
                      'bg-white text-[#0B0D12] hover:bg-white/90 transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]'
                    )}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden />
                    Contact
                  </a>
                  <a
                    href={onSecondaryCtaHref}
                    className={classNames(
                      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
                      'border border-white/20 text-white hover:bg-white/10 transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]'
                    )}
                  >
                    <Cpu className="mr-2 h-4 w-4" aria-hidden />
                    View Résumé
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Photo column */}
          <motion.div
            initial={prefersReduced ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={fadeUp(1, 12)}
            className="order-2 col-span-12 lg:order-2 lg:col-span-5"
          >
            <div
              data-photo
              className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)]"
            >
              {/* Fixed height across breakpoints to avoid CLS */}
              <div className="h-72 sm:h-80 lg:h-[480px]">
                {/* Replace img with Next.js Image if available (see comment above) */}
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-full w-full object-cover"
                  decoding="async"
                  loading="eager"
                />
              </div>

              {/* Diagonal sheen overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(120deg, rgba(255,255,255,0.0) 25%, rgba(255,255,255,0.07) 38%, rgba(255,255,255,0.0) 55%)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;


