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
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
    return () => {
      try { tl.kill(); } catch {}
    };
  }, []);

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div ref={marqueeRef} className="overflow-hidden max-w-6xl mx-auto">
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


