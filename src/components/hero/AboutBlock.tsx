'use client';

import { useRef, forwardRef } from 'react';
import Image from 'next/image';

interface AboutBlockProps {
  className?: string;
}

export const AboutBlock = forwardRef<HTMLDivElement, AboutBlockProps>(({ className = '' }, ref) => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={ref}
      className={`mt-16 grid gap-10 md:grid-cols-[auto_1fr] items-center ${className}`}
    >
      {/* Portrait */}
      <div className="flex justify-center md:justify-start">
        <div
          ref={portraitRef}
          className="portrait-container relative w-[96px] h-[96px] sm:w-[200px] sm:h-[200px] rounded-2xl overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Gradient border overlay */}
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
              opacity: 0.6,
            }}
          />
          
          {/* Image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/images/profile.webp"
              alt="Arthur Wei - Engineer and Creator"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAADsAD+JaQAA3AAAAAA"
              sizes="(max-width: 640px) 96px, 200px"
            />
          </div>
          
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
        </div>
      </div>

      {/* Bio */}
      <div 
        ref={bioRef}
        className="bio-container text-white/90 font-light leading-relaxed tracking-wide lg:ml-10"
      >
        <ul className="space-y-4">
          <li>CS Graduate @ UCSC</li>
          <li>AI/ML & Full-Stack Engineer <span className="text-gray-400">(Python • TypeScript • Go)</span></li>
          <li className="hidden sm:list-item">AWS Certified Solutions Architect <span className="text-gray-400">(SAA-C03)</span></li>
          <li className="hidden sm:list-item">Making AI that is <span className="text-blue-300">intuitive, human-aligned tools</span></li>
        </ul>
      </div>
    </div>
  );
});

AboutBlock.displayName = 'AboutBlock';
