import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Flip from 'gsap/Flip';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import ScrollSmoother from 'gsap/ScrollSmoother';
import SplitText from 'gsap/SplitText';
import Observer from 'gsap/Observer';
import Draggable from 'gsap/Draggable';

// Register GSAP plugins
gsap.registerPlugin(
  ScrollTrigger, 
  Flip, 
  MotionPathPlugin, 
  ScrollSmoother, 
  SplitText, 
  Observer, 
  Draggable
);

// GSAP configuration defaults
export const gsapConfig = {
  defaults: {
    ease: 'power2.out',
    duration: 0.8,
  },
  scrollTrigger: {
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  },
  // New animation presets for the hero
  hero: {
    entrance: {
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.03,
    },
    scroll: {
      duration: 0.8,
      ease: 'power2.inOut',
    },
    micro: {
      duration: 0.6,
      ease: 'power3.out',
    },
  },
};

// Responsive breakpoints for GSAP animations
export const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};

// Animation presets
export const animations = {
  fadeIn: {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out',
  },
  fadeInUp: {
    opacity: 0,
    y: 60,
    duration: 1.2,
    ease: 'power4.out',
  },
  fadeInScale: {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'back.out(1.7)',
  },
  slideInLeft: {
    opacity: 0,
    x: -100,
    duration: 1,
    ease: 'power3.out',
  },
  slideInRight: {
    opacity: 0,
    x: 100,
    duration: 1,
    ease: 'power3.out',
  },
  staggerIn: {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out',
  },
  // New hero-specific animations
  heroText: {
    y: 80,
    rotateX: 60,
    opacity: 0,
    stagger: 0.03,
    ease: 'expo.out',
  },
  orbIdle: {
    scale: 0.8,
    opacity: 0,
    duration: 1.5,
    ease: 'back.out(1.7)',
  },
  orbWobble: {
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  },
};

export { 
  gsap, 
  ScrollTrigger, 
  Flip, 
  MotionPathPlugin, 
  ScrollSmoother, 
  SplitText, 
  Observer, 
  Draggable 
};