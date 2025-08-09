'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapTimelines';
import PhotoGallery from '@/components/scenes/PhotoGallery';

export default function PhotographyPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate hero section
    if (titleRef.current && subtitleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });
    }

    // Animate gallery container (DOM only)
    if (galleryRef.current) {
      gsap.from(galleryRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 85%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        },
      });
    }
    // Ensure triggers recalc after mount
    requestAnimationFrame(() => {
      try { (ScrollTrigger as any).refresh?.(); } catch {}
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-[50vh] flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background/20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold text-foreground mb-4"
          >
            Photography
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground font-light"
          >
            Capturing moments through the lens
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <PhotoGallery />
        </div>
      </section>
    </div>
  );
}