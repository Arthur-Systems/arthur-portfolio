'use client';

import Image from 'next/image';
import React from 'react';

type AboutPhotoProps = {
  className?: string;
};

/**
 * Portrait card with gradient ring, glass background, and shine overlay.
 * Hook target: [data-about-photo]
 */
export const AboutPhoto: React.FC<AboutPhotoProps> = ({ className = '' }) => {
  return (
    <div
      data-about-photo
      className={`relative rounded-2xl p-[2px] shadow-xl shadow-black/30 bg-gradient-to-br from-teal-400/20 via-indigo-500/15 to-violet-500/20 will-change-transform tilt-3d ${className}`}
      aria-label="Portrait of Arthur Wei"
    >
      {/* Inner glass card */}
      <div className="relative overflow-hidden rounded-[1rem] bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 card-elevate" data-hover-card>
        {/* Shine sweep overlay (animated via anime.js) */}
        <span
          data-shine
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1 inset-y-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0"
          style={{ filter: 'blur(2px)' }}
        />

        {/* Image */}
        <div className="relative aspect-[4/5] w-full">
          <Image
            src="/images/profile.webp"
            alt="Portrait placeholder"
            priority={false}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 28rem, 100vw"
          />
        </div>

        {/* Subtle inner border glow */}
        <div className="pointer-events-none absolute inset-0 rounded-[1rem] ring-1 ring-white/10" />
        <div className="pointer-events-none absolute inset-0 rounded-[1rem]" style={{
          background:
            'radial-gradient(80% 60% at 50% 10%, rgba(59,130,246,0.10), transparent 60%), radial-gradient(60% 50% at 100% 100%, rgba(139,92,246,0.10), transparent 60%)',
        }} />
      </div>
    </div>
  );
};

export default AboutPhoto;



