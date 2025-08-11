'use client';

import React from 'react';

type AboutLocationProps = {
  className?: string;
};

/**
 * SF Bay Area spotlight with a simple embedded OpenStreetMap and quick facts.
 */
const AboutLocation: React.FC<AboutLocationProps> = ({ className = '' }) => {
  return (
    <div
      data-about-location
      data-hover-card
      className={`relative w-full rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400/25 via-indigo-500/20 to-fuchsia-500/25 shadow-xl shadow-black/25 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div className="relative rounded-[1rem] overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 card-elevate" data-meta-hover style={{ transformStyle: 'preserve-3d' }}>
        <span
          data-shine
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1 inset-y-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0"
          style={{ filter: 'blur(2px)' }}
        />
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="text-white/90 text-sm font-medium">SF Bay Area</div>
          <div className="text-[11px] text-white/60">San Francisco • Oakland • San Jose</div>
        </div>
        <div className="p-4">
          {/* OSM embed centered on San Francisco with Bay Area bounds */}
          <div className="relative w-full overflow-hidden rounded-md border border-white/10">
            <iframe
              title="SF Bay Area Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-123.10%2C37.00%2C-121.50%2C38.60&layer=mapnik&marker=37.7749%2C-122.4194"
              style={{ width: '100%', height: 260, border: 0 }}
              loading="lazy"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-white/85">
            {['Peninsula', 'South Bay', 'East Bay', 'North Bay'].map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] sm:text-xs backdrop-blur-sm ring-1 ring-white/10"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLocation;


