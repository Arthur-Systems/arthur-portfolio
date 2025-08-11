'use client';

import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';

type AboutCertificationProps = {
  className?: string;
  variant?: 'dark' | 'light';
};

const skills = [
  { topic: 'Compute', score: 92, fill: 'var(--color-aws)' },
  { topic: 'Storage', score: 86, fill: 'var(--color-aws)' },
  { topic: 'Networking', score: 84, fill: 'var(--color-aws)' },
  { topic: 'Security', score: 88, fill: 'var(--color-aws)' },
  { topic: 'Observability', score: 81, fill: 'var(--color-aws)' },
];

const AboutCertification: React.FC<AboutCertificationProps> = ({ className = '', variant = 'dark' }) => {
  const isLight = variant === 'light';
  return (
    <div
      data-about-cert
      data-hover-card
      className={
        isLight
          ? `relative w-full ${className}`
          : `relative w-full rounded-2xl p-[2px] bg-gradient-to-br from-amber-400/25 via-orange-500/20 to-yellow-500/25 shadow-xl shadow-black/25 ${className}`
      }
      style={{ perspective: '1000px' }}
    >
      <div
        className={
          isLight
            ? 'relative rounded-[1rem] overflow-hidden bg-white ring-1 ring-inset ring-neutral-200 card-elevate'
            : 'relative rounded-[1rem] overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 card-elevate'
        }
        data-meta-hover
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span
          data-shine
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1 inset-y-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0"
          style={{ filter: 'blur(2px)' }}
        />
        <div className="flex items-center justify-between px-4 pt-4">
          <div className={isLight ? 'text-neutral-900 text-sm font-medium' : 'text-white/90 text-sm font-medium'}>AWS Certified</div>
          <div className={isLight ? 'text-[11px] text-neutral-500' : 'text-[11px] text-white/60'}>Solutions Architect — Associate (SAA-C03)</div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1">
              <div className={
                isLight
                  ? 'inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-800 ring-1 ring-neutral-200'
                  : 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/85 ring-1 ring-white/10'
              }>
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                SAA-C03
              </div>
              <p className={isLight ? 'mt-3 text-[13px] leading-relaxed text-neutral-700' : 'mt-3 text-[13px] leading-relaxed text-white/80'}>
                Validates ability to design cost-optimized, secure, and resilient architectures on AWS with best-practice services and patterns.
              </p>
            </div>
            <div className="md:col-span-2">
              <ChartContainer
                id="aws-saa"
                className="aspect-[16/9]"
                config={{ aws: { label: 'AWS', color: 'rgb(251, 191, 36)' } }}
              >
                <RadarChart data={skills} cx="50%" cy="50%" outerRadius="80%">
                  <PolarGrid stroke={isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'} />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: isLight ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                  <Radar name="AWS" dataKey="score" stroke="rgb(251, 191, 36)" fill="rgba(251, 191, 36, 0.35)" />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="topic" />} />
                </RadarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCertification;


