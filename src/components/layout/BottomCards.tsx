'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAutoReveal } from '@/hooks/useAutoReveal';
import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap/config';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function BottomCards() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const headshotRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  useAutoReveal({ root: rootRef.current });

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current as HTMLElement;
    if (reduced) {
      // Reduced motion: no pin, just reveal elements
      gsap.set(root.querySelectorAll('.intro-h1 .word'), { opacity: 1, y: 0 });
      gsap.set(root.querySelector('.intro-sub'), { opacity: 1, y: 0 });
      gsap.set(root.querySelectorAll('.intro-stat'), { opacity: 1, y: 0 });
      gsap.set(root.querySelector('.intro-photo'), { opacity: 1, clipPath: 'inset(0 0 0 0%)', scale: 1 });
      gsap.set(root.querySelector('.intro-photo-halo'), { opacity: 0.35, scale: 1 });
      return;
    }

    const mm = gsap.matchMedia();
    const cleanupFns: Array<() => void> = [];

    // Desktop: pinned timeline
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=120%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1) Headline words
      {
        const words = root.querySelectorAll('.intro-h1 .word');
        if (words.length) {
          tl.fromTo(
            words,
            { opacity: 0, y: '1em' },
            { opacity: 1, y: '0em', stagger: 0.05, duration: 0.5 }
          );
        }
      }

      // 2) Subline
      {
        const sub = root.querySelector('.intro-sub');
        if (sub) {
          tl.fromTo(
            sub,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.35 },
            '>-0.1'
          );
        }
      }

      // 3) Stats (slide up)
      {
        const stats = root.querySelectorAll('.intro-stat');
        if (stats.length) {
          tl.fromTo(
            stats,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.35 },
            '>-0.05'
          );
        }
      }

      // Count-up once (not scrubbed)
      const statsTrigger = root.querySelector('.stats');
      const st = statsTrigger
        ? ScrollTrigger.create({
            trigger: statsTrigger,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              root.querySelectorAll<HTMLElement>('.intro-stat [data-count]').forEach((el) => {
                const target = Number(el.dataset.count || '0');
                const obj = { n: 0 } as { n: number };
                gsap.to(obj, {
                  n: target,
                  duration: 0.8,
                  ease: 'power1.out',
                  onUpdate: () => { el.innerText = formatNumber(obj.n, target); },
                });
              });
            },
          })
        : null;

      // 4) Photo reveal (late)
      {
        const photo = root.querySelector('.intro-photo');
        if (photo) {
          tl.fromTo(
            photo,
            { clipPath: 'inset(0 0 0 100%)', scale: 1.08, opacity: 0.0 },
            { clipPath: 'inset(0 0 0 0%)', scale: 1.0, opacity: 1, duration: 0.6 },
            '>+0.05'
          );
        }
      }

      // Halo behind photo
      {
        const halo = root.querySelector('.intro-photo-halo');
        if (halo) {
          tl.fromTo(
            halo,
            { opacity: 0, scale: 0.9 },
            { opacity: 0.35, scale: 1, duration: 0.5 },
            '<'
          );
        }
      }

      cleanupFns.push(() => tl.scrollTrigger?.kill());
      if (st) cleanupFns.push(() => st.kill());
    });

    // Mobile: simple fade/slide once, no pin
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const wordsM = root.querySelectorAll('.intro-h1 .word');
      if (wordsM.length) tl.fromTo(wordsM, { opacity: 0, y: '1em' }, { opacity: 1, y: '0', stagger: 0.04, duration: 0.4 });
      const subM = root.querySelector('.intro-sub');
      if (subM) tl.fromTo(subM, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, '>-0.05');
      const statsM = root.querySelectorAll('.intro-stat');
      if (statsM.length) tl.fromTo(statsM, { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.3 }, '>-0.05');
      const photoM = root.querySelector('.intro-photo');
      if (photoM) tl.fromTo(photoM, { opacity: 0, x: 24, scale: 1.02 }, { opacity: 1, x: 0, scale: 1, duration: 0.35 }, '>-0.05');
      const haloM = root.querySelector('.intro-photo-halo');
      if (haloM) tl.fromTo(haloM, { opacity: 0 }, { opacity: 0.35, duration: 0.3 }, '<');

      const st2 = ScrollTrigger.create({ trigger: root, start: 'top 85%', once: true, onEnter: () => tl.play(0) });
      cleanupFns.push(() => st2.kill());
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
      mm.kill();
    };
  }, [reduced]);

  const headlineWords = useMemo(() => {
    return 'I build reliable AI systems.'.split(' ').map((w, i) => (
      <span key={i} className="word inline-block mr-2">{w}</span>
    ));
  }, []);

  function formatNumber(cur: number, target: number) {
    const rounded = Math.round(cur);
    return String(rounded);
  }

  return (
    <div ref={rootRef} className="intro px-[var(--space-24)] py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-12" data-reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 text-center md:text-left max-w-[68ch] mx-auto md:mx-0">
              <h2 ref={headingRef} className="intro-h1 font-sora text-[length:var(--type-display)] tracking-tight font-semibold leading-tight">
                {headlineWords}
              </h2>
              <p className="intro-sub mt-4 text-[16px] text-[hsl(var(--text-2))]">From on-device vision to cloud APIs, I ship measured, maintainable platforms.</p>
              <div className="stats mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="intro-stat rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.04)] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <div className="text-2xl font-semibold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#49D0C1,#9be8df)' }}>
                    <span data-count="120">0</span><span className="ml-1">ms</span>
                  </div>
                  <div className="text-[14px] text-[hsl(var(--text-2))]">p95 inference</div>
                </div>
                <div className="intro-stat rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.04)] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <div className="text-2xl font-semibold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#49D0C1,#9be8df)' }}>
                    <span className="mr-1">–</span><span data-count="65">0</span><span className="ml-1">%</span>
                  </div>
                  <div className="text-[14px] text-[hsl(var(--text-2))]">MTTR with tracing</div>
                </div>
                <div className="intro-stat rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.04)] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <div className="text-2xl font-semibold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#49D0C1,#9be8df)' }}>
                    3–4k
                  </div>
                  <div className="text-[14px] text-[hsl(var(--text-2))]">req/min bursts</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 hidden md:block justify-self-end relative">
              <div className="intro-photo-halo absolute -inset-6 rounded-[var(--radius)]" style={{ background: 'radial-gradient(60% 60% at 60% 40%, rgba(73,208,193,0.30), transparent 70%)', filter: 'blur(18px)', pointerEvents: 'none' }} />
              <div ref={headshotRef} className="intro-photo rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.06)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden w-[min(360px,38vw)] aspect-[4/5]">
                <Image src="/images/profile.webp" alt="Portrait of Arthur Wei" fill className="object-cover" sizes="(min-width: 1024px) 360px, 60vw" />
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}


