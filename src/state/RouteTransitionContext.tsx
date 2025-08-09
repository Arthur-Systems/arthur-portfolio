'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader } from '@/state/loaderBus';
import { fullGsapTeardown } from '@/lib/gsapCleanup';
import { NavDebugBus } from '@/state/navDebugBus';

type RouteTransitionContextValue = {
  startTransition: (label?: string) => void;
  finishTransition: () => void;
  createAbortController: (label?: string) => AbortController;
  abortAll: () => void;
  isTransitioning: boolean;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const controllersRef = useRef<Set<AbortController>>(new Set());
  const navActionIdRef = useRef(0);
  const prevKeyRef = useRef<string | null>(null);

  const startTransition = useCallback((label?: string) => {
    navActionIdRef.current += 1;
    setIsTransitioning(true);
    Loader.start(label ?? 'Navigating…');
    NavDebugBus.emit({ type: 'transition-start', ts: performance.now() });
  }, []);

  const finishTransition = useCallback(() => {
    const ts = performance.now();
    Loader.finish();
    setIsTransitioning(false);
    // Focus main heading if present
    try {
      const main = document.querySelector('main');
      const h1 = main?.querySelector('h1, [role="heading"][aria-level="1"]') as HTMLElement | null;
      h1?.focus?.();
    } catch {}
    const buf = NavDebugBus.getBuffer();
    const start = [...buf].reverse().find((e) => e.type === 'transition-start') as any;
    const duration = start ? ts - (start.ts as number) : 0;
    NavDebugBus.emit({ type: 'transition-finish', ts, durationMs: duration });
  }, []);

  const abortAll = useCallback(() => {
    controllersRef.current.forEach((c) => {
      try { c.abort(); } catch {}
    });
    controllersRef.current.clear();
  }, []);

  const createAbortController = useCallback((label?: string) => {
    const ctrl = new AbortController();
    controllersRef.current.add(ctrl);
    const onDone = () => controllersRef.current.delete(ctrl);
    ctrl.signal.addEventListener('abort', onDone, { once: true });
    return ctrl;
  }, []);

  // Centralized route-change handling
  useEffect(() => {
    const key = `${pathname}?${searchParams?.toString() ?? ''}`;
    if (prevKeyRef.current === null) {
      prevKeyRef.current = key;
      return;
    }
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    // Begin navigation transition
    startTransition();

    // Abort any in-flight work from the previous route
    abortAll();

    // Teardown GSAP scroll triggers and any sticky artifacts, then restore scroll
    // Do this over multiple frames to ensure the new DOM is ready
    requestAnimationFrame(() => {
      fullGsapTeardown();
      requestAnimationFrame(() => {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        } catch {
          window.scrollTo({ top: 0, left: 0 });
        }
        requestAnimationFrame(() => finishTransition());
      });
    });
  }, [pathname, searchParams, abortAll, startTransition, finishTransition]);

  const value = useMemo<RouteTransitionContextValue>(
    () => ({ startTransition, finishTransition, createAbortController, abortAll, isTransitioning }),
    [startTransition, finishTransition, createAbortController, abortAll, isTransitioning]
  );

  return (
    <RouteTransitionContext.Provider value={value}>{children}</RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const ctx = useContext(RouteTransitionContext);
  if (!ctx) throw new Error('useRouteTransition must be used within RouteTransitionProvider');
  return ctx;
}


