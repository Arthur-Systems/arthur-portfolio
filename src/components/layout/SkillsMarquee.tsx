'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const techLogos = [
  'React', 'Next.js', 'TypeScript', 'GSAP', 'Node.js',
  'Python', 'PostgreSQL', 'Docker', 'AWS', 'Figma', 
];

export default function SkillsMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!marqueeRef.current) return;
    const el = marqueeRef.current;
    const tl = gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
        once: true,
      },
    });
    return () => {
      try { tl.kill(); } catch {}
    };
  }, []);

  return (
    <section className="py-[var(--space-24)] px-[var(--space-24)]">
      <div ref={marqueeRef} className="overflow-hidden mx-auto w-full max-w-[1200px]">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap">
          {techLogos.map((logo, index) => (
            <div
              key={index}
              className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 py-2"
            >
              {logo}
            </div>
          ))}
          {techLogos.map((logo, index) => (
            <div
              key={`dup-${index}`}
              className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 py-2"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


