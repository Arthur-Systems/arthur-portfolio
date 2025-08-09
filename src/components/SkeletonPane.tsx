'use client';

import React from 'react';

type Props = {
  label?: string;
};

export default function SkeletonPane({ label }: Props) {
  return (
    <div className="relative w-full max-w-full" aria-busy="true" aria-live="polite">
      {/* 16:9 shell */}
      <div className="relative w-full bg-neutral-900/70 border border-white/10 rounded-xl shadow-lg overflow-hidden">
        <div className="pt-[56.25%]" />
        <div className="absolute inset-0 skeleton-shimmer" />

        {/* Scrubber line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
          <div className="h-full w-1/3 bg-indigo-600/70 animate-pulse" />
        </div>

        {/* Ghost thumbs for Start/End */}
        <div className="absolute bottom-2 left-2 h-6 w-10 rounded bg-white/10 border border-white/10 shadow-sm" />
        <div className="absolute bottom-2 right-2 h-6 w-10 rounded bg-white/10 border border-white/10 shadow-sm" />
      </div>
      {label && <div className="mt-2 text-xs text-neutral-400">{label}</div>}
    </div>
  );
}


