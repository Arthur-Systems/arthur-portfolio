'use client';

import React from 'react';

type AboutHighlightsProps = {
  className?: string;
};

export const AboutHighlights: React.FC<AboutHighlightsProps> = ({ className = '' }) => {
  const chips = [
    'AI pipelines & computer vision',
    'High-performance & distributed systems',
    'Secure, reliable cloud services',
    'Human-centered innovation',
  ];

  return (
    <div data-about-chips className={`flex flex-wrap gap-2 sm:gap-3 ${className}`}>
      {chips.map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 text-white/85 px-3 py-1.5 text-xs sm:text-sm backdrop-blur-sm shadow-sm shadow-black/20 card-elevate"
          data-hover-card
        >
          {label}
        </span>
      ))}
    </div>
  );
};

export default AboutHighlights;



