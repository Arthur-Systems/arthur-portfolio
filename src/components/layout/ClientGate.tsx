'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useUIReady } from '@/hooks/useUIReady';
import { Loader } from '@/state/loaderBus';

type Props = { children: ReactNode };

export default function ClientGate({ children }: Props) {
  const { isReady, setReady, setStep } = useUIReady();

  useEffect(() => {
    Loader.start('Booting UI…');
    const loadLibraries = async () => {
      const stepTimeout = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
      const fastTimeout = stepTimeout(900);

      try {
        // Kick off loading in the background; do not block readiness
        const p1 = Promise.race([import('gsap'), fastTimeout]).catch(() => {});
        const p2 = Promise.race([import('gsap/ScrollTrigger'), fastTimeout]).catch(() => {});
        const p3 = Promise.race([
          Promise.all([
            import('gsap/Flip').catch(() => {}),
            import('gsap/Observer').catch(() => {}),
            import('gsap/Draggable').catch(() => {}),
            // SplitText is club plugin – ignore if unavailable
            import('gsap/SplitText').catch(() => {}),
          ]),
          fastTimeout,
        ]).catch(() => {});

        // Wait for DOM to settle a tiny bit, then mark ready
        setStep('Finalizing…');
        Loader.step(20, 'Fonts & layout…');
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: any) => number);
        if (ric) {
          await new Promise<void>((resolve) => ric(() => resolve(), { timeout: 120 }));
        } else {
          await stepTimeout(60);
        }
        setReady(true);
        setStep('Ready');
        Loader.step(60, 'Animating in…');

        // Refresh ScrollTrigger once libs are likely ready
        Promise.allSettled([p1, p2, p3]).finally(async () => {
          try {
            const mod = await import('gsap/ScrollTrigger');
            (mod as any).default?.refresh?.();
          } catch {}
          Loader.finish();
        });
      } catch (error) {
        console.error('Failed to load client libraries:', error);
        setReady(true);
        setStep('Error — continuing');
        Loader.finish();
      }
    };

    loadLibraries();
  }, [setReady, setStep]);

  return <>{children}</>;
}
