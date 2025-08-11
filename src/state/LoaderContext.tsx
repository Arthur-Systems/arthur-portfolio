'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LoaderBus } from './loaderBus';
import type { LoaderEvent } from './loaderBus';

export type LoaderContextValue = {
  isLoading: boolean;
  progress: number; // 0-100
  status: string;
  start: (label?: string) => void;
  step: (delta: number, label?: string) => void;
  finish: () => void;
};

const LoaderContext = createContext<LoaderContextValue | null>(null);

// requestIdleCallback fallback
function runWhenIdle(cb: () => void, timeout = 150) {
  const ric = (typeof window !== 'undefined' && (window as any).requestIdleCallback) as
    | undefined
    | ((cb: () => void, opts?: any) => number);
  if (ric) {
    ric(() => cb(), { timeout });
  } else {
    setTimeout(cb, Math.min(timeout, 150));
  }
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing…');
  const [animatingOut, setAnimatingOut] = useState(false);
  const actionIdRef = useRef(0);

  const start = useCallback((label?: string) => {
    actionIdRef.current += 1;
    setStatus(label ?? 'Loading…');
    setProgress(0);
    setAnimatingOut(false);
    setIsLoading(true);
  }, []);

  const step = useCallback((delta: number, label?: string) => {
    setProgress((p) => {
      const next = Math.max(0, Math.min(100, p + (Number.isFinite(delta) ? delta : 0)));
      return next;
    });
    if (label) setStatus(label);
  }, []);

  const finish = useCallback(() => {
    const currentAction = actionIdRef.current;
    setProgress(100);
    setStatus('Ready');
    // Hold a touch after reaching 100% for perceptual smoothness, then fade out and unmount
    setAnimatingOut(true);
    setTimeout(() => {
      // Defer non-critical work to idle to avoid jank
      runWhenIdle(() => {
        if (actionIdRef.current !== currentAction) return; // another load started
        setIsLoading(false);
        setAnimatingOut(false);
      }, 120);
    }, 120);
  }, []);

  // Side-effects for a11y and background interactivity
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      // Avoid hydration mismatch by only toggling aria-busy after hydration.
      // SSR sets aria-busy={false} statically in layout.
      if (typeof window !== 'undefined') {
        mainEl.setAttribute('aria-busy', isLoading ? 'true' : 'false');
      }
      // Try inert if supported
      try {
        if (isLoading) {
          (mainEl as any).inert = true;
        } else {
          (mainEl as any).inert = false;
        }
      } catch {}
    }
    // Prevent ESC while busy
    const onKey = (e: KeyboardEvent) => {
      if (!isLoading) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true } as any);
  }, [isLoading]);

  const value = useMemo<LoaderContextValue>(
    () => ({ isLoading, progress, status, start, step, finish }),
    [isLoading, progress, status, start, step, finish]
  );

  // Bridge imperative Loader API to context state
  useEffect(() => {
    const unsub = LoaderBus.subscribe((evt: LoaderEvent) => {
      if (evt.type === 'start') start(evt.label);
      if (evt.type === 'step') step(evt.delta ?? 0, evt.label);
      if (evt.type === 'finish') finish();
      return false as any; // satisfy EffectCallback typing in some TS configs
    });
    return () => { unsub(); };
  }, [start, step, finish]);

  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
}

export function useLoaderContextInternal() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useLoader must be used within LoaderProvider');
  return ctx;
}


