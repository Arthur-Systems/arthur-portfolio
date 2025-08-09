import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const useScrollToTop = () => {
  const pathname = usePathname();
  const hasScrolled = useRef(false);

  useEffect(() => {
    // Reset flag on pathname change
    hasScrolled.current = false;

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    };

    // Defer scroll to ensure GSAP ScrollTrigger is ready
    const deferredScroll = () => {
      if (hasScrolled.current) return;
      
      // Use multiple requestAnimationFrame calls to ensure DOM is fully ready
      // and GSAP ScrollTrigger has been initialized
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!hasScrolled.current) {
              scrollToTop();
              hasScrolled.current = true;
            }
          });
        });
      });
    };

    // Wait a bit longer to ensure ClientGate has finished loading
    // and the portal-based overlay is no longer blocking scroll restoration
    const timer = setTimeout(() => {
      deferredScroll();
    }, 300); // Increased delay to account for portal rendering

    // Also handle page load events
    const handleLoad = () => {
      if (!hasScrolled.current) {
        deferredScroll();
      }
    };

    const handleDOMContentLoaded = () => {
      if (!hasScrolled.current) {
        deferredScroll();
      }
    };

    window.addEventListener('load', handleLoad);
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, [pathname]);
};
