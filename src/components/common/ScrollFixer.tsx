'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { fullGsapTeardown } from '@/lib/gsapCleanup';
import { scrollToTop } from '@/lib/utils';

export function ScrollFixer() {
  const pathname = usePathname();

  useEffect(() => {
    // Clean up any GSAP state from the previous page first
    fullGsapTeardown();
    // After teardown + next paint, jump to top to avoid pinned states
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTop();
        try { (window as any).ScrollTrigger?.refresh?.(); } catch {}
      });
    });
  }, [pathname]);

  return null;
}


