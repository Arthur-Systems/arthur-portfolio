import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if this is a subdomain (more than 2 parts)
  if (parts.length > 2) {
    const subdomain = parts[0];
    if (!subdomain) return null;
    const validSubdomains = ['photo', 'video', 'tech'];
    return validSubdomains.includes(subdomain) ? subdomain : null;
  }
  
  return null;
}

export function getSubdomainLabel(subdomain: string | null): string {
  if (!subdomain) return '';
  
  const labels: Record<string, string> = {
    'photo': 'Photography',
    'video': 'Film',
    'tech': 'Software Dev',
  };
  
  return labels[subdomain] || subdomain;
}

export function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}

export function isSubdomainChange(currentHostname: string, previousHostname: string): boolean {
  const currentSubdomain = currentHostname.split('.')[0];
  const previousSubdomain = previousHostname.split('.')[0];
  return currentSubdomain !== previousSubdomain;
}

// Debug utility for ScrollTrigger issues
export function debugScrollTrigger() {
  if (typeof window === 'undefined') return;
  
  // Check for orphaned pin-spacers
  const pinSpacers = document.querySelectorAll('.gsap-pin-spacer');
  console.log(`Found ${pinSpacers.length} pin-spacers in DOM`);
  
  // Check ScrollTrigger count (if GSAP is available)
  if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
    const triggers = (window as any).ScrollTrigger.getAll();
    console.log(`Active ScrollTriggers: ${triggers.length}`);
  }
  
  // Check current scroll position
  console.log(`Current scrollY: ${window.scrollY}`);
  console.log(`Current scrollTop: ${document.documentElement.scrollTop}`);
}

// Debug utility for viewport locking issues
export function debugViewportLock() {
  if (typeof window === 'undefined') return;
  
  const html = document.documentElement;
  const body = document.body;
  
  console.log('=== Viewport Lock Debug ===');
  console.log('HTML overflow:', html.style.overflow);
  console.log('HTML height:', html.style.height);
  console.log('Body overflow:', body.style.overflow);
  console.log('Body height:', body.style.height);
  console.log('Body position:', body.style.position);
  console.log('Window scrollY:', window.scrollY);
  console.log('Document scrollTop:', document.documentElement.scrollTop);
  
  // Check for GSAP wrappers
  const smoothWrapper = document.getElementById('smooth-wrapper');
  if (smoothWrapper) {
    console.log('Smooth wrapper exists:', !!smoothWrapper);
    console.log('Smooth wrapper styles:', smoothWrapper.style.cssText);
  }
  
  // Check for ScrollSmoother (safely)
  try {
    if (typeof window !== 'undefined' && (window as any).ScrollSmoother) {
      const smoother = (window as any).ScrollSmoother.get();
      console.log('ScrollSmoother active:', !!smoother);
    }
  } catch (error) {
    console.log('ScrollSmoother not available');
  }
  
  console.log('========================');
}
