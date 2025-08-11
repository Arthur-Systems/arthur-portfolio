'use client';

import React, { forwardRef } from 'react';
import { Brain, Cpu, Users, ShieldCheck, type LucideIcon } from 'lucide-react';

export interface HeroChipsProps {
  className?: string;
}

type Chip = { label: string; Icon: LucideIcon; iconClass?: string };

const chips: Chip[] = [
  { label: 'AI pipelines & computer vision', Icon: Brain, iconClass: 'text-emerald-300/90' },
  { label: 'High-performance & distributed systems', Icon: Cpu, iconClass: 'text-sky-300/90' },
  { label: 'Human-centered innovation', Icon: Users, iconClass: 'text-fuchsia-300/90' },
  { label: 'Secure, reliable cloud services', Icon: ShieldCheck, iconClass: 'text-orange-300/90' },
];

const HeroChips = forwardRef<HTMLDivElement, HeroChipsProps>(function HeroChips(
  { className = '' },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${className}`}
      data-hero-chips
    >
      {chips.map(({ label, Icon, iconClass }) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm text-white/80"
        >
          <Icon className={`h-4 w-4 ${iconClass ?? 'text-white/80'}`} aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  );
});

export default HeroChips;


