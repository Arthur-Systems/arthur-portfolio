'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { NavDebugBus } from '@/state/navDebugBus';
import { useRouteTransition } from '@/state/RouteTransitionContext';

export function useNavigationEvents() {
  const router = useRouter();
  return useMemo(() => {
    return {
      push: (href: string) => {
        NavDebugBus.emit({ type: 'router-push', href, ts: performance.now() });
        router.push(href);
      },
      replace: (href: string) => {
        NavDebugBus.emit({ type: 'router-replace', href, ts: performance.now() });
        router.replace(href);
      },
      prefetch: (href: string) => {
        NavDebugBus.emit({ type: 'router-prefetch', href, ts: performance.now() });
        router.prefetch(href);
      },
    } as const;
  }, [router]);
}

export default function NavigationObserver() {
  const pathname = usePathname();
  const search = useSearchParams();
  const { isTransitioning } = useRouteTransition();

  useEffect(() => {
    NavDebugBus.emit({
      type: 'router-change',
      pathname: pathname ?? '',
      search: search?.toString() ?? '',
      ts: performance.now(),
    });
  }, [pathname, search]);

  useEffect(() => {
    const onError = (message: string | Event, source?: string, lineno?: number, colno?: number, error?: any) => {
      NavDebugBus.emit({
        type: 'error',
        message: typeof message === 'string' ? message : 'window.onerror',
        stack: error?.stack,
        ts: performance.now(),
      });
      return false;
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      NavDebugBus.emit({
        type: 'error',
        message: e.reason?.message ?? 'unhandledrejection',
        stack: e.reason?.stack,
        ts: performance.now(),
      });
    };
    window.addEventListener('error', onError as any);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError as any);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  useEffect(() => {
    let startTs = 0;
    const unsub = NavDebugBus.subscribe((evt) => {
      if (evt.type === 'transition-start') startTs = evt.ts;
      if (evt.type === 'transition-finish' && startTs) {
        // already includes duration in evt
      }
    });
    return () => {
      unsub();
    };
  }, []);

  return null;
}

export function NavigationDiagnosticsOverlay() {
  const [events, setEvents] = useState(NavDebugBus.getBuffer());
  useEffect(() => {
    const unsub = NavDebugBus.subscribe(() => setEvents(NavDebugBus.getBuffer()));
    return () => {
      unsub();
    };
  }, []);
  const enabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugNav') === '1';
  if (!enabled) return null;
  return (
    <div style={{ position: 'fixed', right: 8, bottom: 8, zIndex: 99999, width: 360, maxHeight: '50vh', overflow: 'auto', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 12, padding: 8, borderRadius: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Navigation Diagnostics</div>
      {events.slice(-30).map((e, idx) => (
        <div key={idx} style={{ opacity: 0.9 }}>
          {new Date(performance.timeOrigin + e.ts).toLocaleTimeString()} — {e.type}
          {('href' in e && e.href) ? ` ${e.href}` : ''}
          {('pathname' in e && e.pathname) ? ` ${e.pathname}` : ''}
          {('message' in e && e.message) ? ` ${e.message}` : ''}
          {('durationMs' in e && e.durationMs !== undefined) ? ` (${Math.round(e.durationMs)}ms)` : ''}
        </div>
      ))}
    </div>
  );
}



