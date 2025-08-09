/**
 * Minimalist Hero Container for About-Me Landing Page
 * 
 * Animation Timing Guide:
 * - Initial delay: 0.5s (line 45)
 * - Headline fade-in: 1.2s duration (line 48)
 * - Tagline fade-in: 0.8s duration, -0.4s offset (line 54)
 * - CTA buttons: 0.6s duration, staggered 0.1s, -0.2s offset (line 60)
 * - Scroll indicator: 0.6s duration, -0.3s offset (line 66)
 * 
 * To adjust timings:
 * - Modify the delay in gsap.timeline({ delay: 0.5 })
 * - Adjust individual animation durations and offsets
 * - Change stagger timing for CTA buttons
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { usePathname } from 'next/navigation';
import { Headline } from './Headline';
import { ScrollIndicator } from './ScrollIndicator';
import { CustomScrollbar } from './CustomScrollbar';
import { AboutBlock } from './AboutBlock';

export const HeroContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const aboutBlockRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const reducedMotion = useReducedMotion();
  const { isLowPerformance } = usePerformanceMonitor();
  const pathname = usePathname();

  // Initial cleanup effect
  useEffect(() => {
    const pinSpacers = document.querySelectorAll('.gsap-pin-spacer');
    pinSpacers.forEach(spacer => {
      if (spacer.parentNode) {
        spacer.parentNode.removeChild(spacer);
      }
    });
    
    ScrollTrigger.getAll().forEach(trigger => {
      trigger.kill(true);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !headlineRef.current || !taglineRef.current || !ctaContainerRef.current || !aboutBlockRef.current || !scrollIndicatorRef.current || !backgroundRef.current) return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize timeline with context for proper cleanup
    const ctx = gsap.context(() => {
      // Initial fade-in sequence
      const tl = gsap.timeline({ delay: 0.5 });
      
      if (!reducedMotion && !isLowPerformance) {
        // Headline animation
        tl.from(headlineRef.current, {
          opacity: 0,
          y: 60,
          duration: 1.2,
          ease: 'power3.out',
        })
        // Tagline animation
        .from(taglineRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4')
        // CTA buttons animation
        .from(() => Array.from(ctaContainerRef.current!.children) as HTMLElement[], {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }, '-=0.2')
        // About block animation
        .from(aboutBlockRef.current!.querySelector('.portrait-container'), {
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4')
        .from(aboutBlockRef.current!.querySelector('.bio-container'), {
          opacity: 0,
          x: 50,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4')
        // Scroll indicator animation
        .from(scrollIndicatorRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.3');
      } else {
        // Static fallback for reduced motion
        gsap.set([headlineRef.current, taglineRef.current, ctaContainerRef.current!.children, aboutBlockRef.current!.querySelector('.portrait-container'), aboutBlockRef.current!.querySelector('.bio-container'), scrollIndicatorRef.current], {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
        });
      }

      // Parallax background effect
      if (!reducedMotion && !isLowPerformance) {
        gsap.to(backgroundRef.current, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

              // Scale down effect on scroll
        if (!reducedMotion && !isLowPerformance) {
          gsap.to([headlineRef.current, taglineRef.current, ctaContainerRef.current], {
            scale: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top center',
              end: 'center center',
              scrub: true,
            },
          });
        }

        // Parallax effect for about block (without pinning)
        if (!reducedMotion && !isLowPerformance) {
          gsap.to(aboutBlockRef.current, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: aboutBlockRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

      // Hide scroll indicator on first scroll
      let hasScrolled = false;
      const handleScroll = () => {
        if (!hasScrolled && !reducedMotion && !isLowPerformance) {
          hasScrolled = true;
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });

      setIsInitialized(true);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, containerRef.current);

    // Refresh ScrollTrigger after initialization
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      setIsInitialized(false);
    };
  }, [pathname, reducedMotion, isLowPerformance]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      role="region"
      aria-label="Hero section"
    >
      {/* Background with seamless gradient */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #000000 50%, #0f172a 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 text-center">
        <Headline ref={headlineRef} />
        <p 
          ref={taglineRef}
          className="mt-2 text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
        >
          Bay-Area engineer + creator
        </p>
        
        {/* CTA Buttons */}
        <div 
          ref={ctaContainerRef}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
        >
          <a
            href="/photography"
            className={`px-8 py-3 border text-sm tracking-wider uppercase transition-all duration-300 ${
              pathname === '/photography' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-400'
            }`}
            aria-label="Go to Photography section"
          >
            Photography
          </a>
          <a
            href="/tech"
            className={`px-8 py-3 border text-sm tracking-wider uppercase transition-all duration-300 ${
              pathname === '/tech' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-400'
            }`}
            aria-label="Go to Software Dev section"
          >
            Software Dev
          </a>
          <a
            href="/video"
            className={`px-8 py-3 border text-sm tracking-wider uppercase transition-all duration-300 ${
              pathname === '/video' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-400'
            }`}
            aria-label="Go to Film section"
          >
            Film
          </a>
        </div>

        {/* About Block */}
        <AboutBlock ref={aboutBlockRef} />
        
        {/* Get in Contact Button */}
        <div className="mt-16 flex justify-center">
          <a
            href="mailto:arthur@example.com"
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="Get in contact via email"
          >
            Get in Contact
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator ref={scrollIndicatorRef} />

      {/* Accessibility announcement */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        Hero section with Arthur Wei's name and navigation links
      </div>
    </section>
  );
};