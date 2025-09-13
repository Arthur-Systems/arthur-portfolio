'use client';

import React, { useEffect, useRef } from 'react';
import { useAutoReveal } from '@/hooks/useAutoReveal';
import AboutPhoto from './AboutPhoto';
import AboutHighlights from './AboutHighlights';
import AboutEmbeds from './AboutEmbeds';
import AboutLocation from './AboutLocation';
import { initAboutFx, killAboutFx } from '@/lib/aboutFx';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { initMetaFx, killMetaFx } from '../../lib/aboutMetaFx';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

  useAutoReveal({ root: rootRef.current as unknown as HTMLElement | null });

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
              data-reveal
            >
              About Me
            </h2>
            <div className="mt-2 h-px w-28 bg-gradient-to-r from-cyan-400/70 via-indigo-400/60 to-transparent" aria-hidden />

            <p
              data-about-intro
              className="mt-5 font-inter text-[clamp(1rem,1.05vw,1.125rem)] leading-relaxed text-white/85 max-w-[65ch]"
              data-reveal
            >
From on device inference to cloud APIs, I build end to end AI systems that scale. I help teams ship faster with platforms that are resilient, measurable, and easy to maintain.            </p>

            <div className="mt-8">
              <div
                className="rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400/25 via-indigo-500/20 to-fuchsia-500/25 shadow-xl shadow-black/25"
                data-hover-card
                data-about-goals
                data-reveal
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






          </div>
        </div>

        {/* Spotlight: Location (full-width subsection) */}
        <section
          id="Location"
          data-about-block="location"
          className="mt-10 w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[radial-gradient(120%_100%_at_0%_0%,rgba(34,211,238,0.12),transparent_60%),radial-gradient(120%_100%_at_100%_100%,rgba(99,102,241,0.12),transparent_60%)]"
          data-reveal
        >
          <div className="container mx-auto max-w-6xl px-6 py-10 md:py-14">
            <AboutLocation className="w-full" />
          </div>
        </section>

        {/* AWS credential card */}
        <section id="AWS" data-about-block="aws" className="mt-10 w-full" data-reveal>
          <div className="rounded-2xl p-[2px] bg-gradient-to-br from-amber-400/25 via-orange-500/20 to-yellow-500/25 shadow-xl shadow-black/25" data-hover-card>
            <div className="relative rounded-[1rem] overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 p-6 sm:p-7" data-meta-hover>
              <div aria-hidden className="pointer-events-none absolute -top-8 right-[-10%] h-40 w-40 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(251,191,36,0.8) 0%, rgba(251,191,36,0.0) 70%)' }} />
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white text-[18px] sm:text-[20px] font-semibold">
                  AWS Certified Solutions Architect (SAA-C03)
                </h3>
                <a
                  href="https://www.credly.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-9 items-center rounded-md border border-white/15 bg-white/10 px-3 text-xs font-medium text-white/90 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
                >
                  Verify
                </a>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="AWS services">
                {['S3','Lambda','API Gateway','EC2','RDS','VPC','CloudWatch','IAM'].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] sm:text-[13px] text-white/85 ring-1 ring-white/10 transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
                    data-interactive
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/90">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-300" aria-hidden />
                  <span className="text-[14px] leading-[1.6]">
                    Designed highly available systems that reduced infra cost 25–30% while meeting 99.95% uptime
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-300" aria-hidden />
                  <span className="text-[14px] leading-[1.6]">
                    Built serverless APIs (Lambda + API Gateway) handling ~2–5M requests/month
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-300" aria-hidden />
                  <span className="text-[14px] leading-[1.6]">
                    Hardened security with IAM least privilege and VPC segmentation across prod/staging
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-300" aria-hidden />
                  <span className="text-[14px] leading-[1.6]">
                    Implemented CloudWatch dashboards + X-Ray to cut MTTR from 45m → 12m
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-300" aria-hidden />
                  <span className="text-[14px] leading-[1.6]">
                    Automated CI/CD to Lambda/EC2 with IaC readiness (Terraform/CloudFormation)
                  </span>
                </li>
              </ul>
              <p className="mt-5 text-[12px] text-white/60">
                Serverless and VPC networking across prod + staging, IaC ready.
              </p>
            </div>
          </div>
        </section>

        {/* Personal section (direct on page) */}
        <div data-about-extra className="mt-12 w-full" data-reveal>
          <div aria-hidden className="h-1 w-full bg-gradient-to-r from-emerald-400/70 via-indigo-400/60 to-fuchsia-400/70" />
          <h3 className="mt-4 text-white/90 text-[17px] font-semibold tracking-wide">What do I do outside of work?</h3>
          <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-white/85 max-w-3xl">
            Beyond systems and infrastructure, I care about teams and the craft. I like aligning product, platform, and people—so shipping ambitious systems stays humane and sustainable.
          </p>
        </div>

        {/* Outside of work */}
        <div data-about-hobbies className="mt-10">
          <h3 className="text-white font-semibold">Outside of work</h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Mountain biking', icon: '🏔️🚴' },
              { label: 'Photography  ', icon: '📸' },
              { label: 'Nature exploring', icon: '🌲' },
              { label: 'Videography', icon: '🎥' },
            ].map((item) => (
              <Card key={item.label} className="border-white/10 bg-white/5">
                <CardContent className="flex items-center gap-2 py-2 text-white/90">
                  <span aria-hidden>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Embeds */}
        <AboutEmbeds className="mt-10" />

      </div>
    </section>
  );
};

export default AboutSection;


