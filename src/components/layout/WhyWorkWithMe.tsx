'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap/config';

type StatSpec = {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STATS: StatSpec[] = [
  { target: 120, suffix: 'ms', label: 'p95 inference' },
  { target: -65, suffix: '%', label: 'MTTR with tracing' },
  { target: 2.4, decimals: 1, suffix: '×', label: 'faster streaming eval API' },
  { target: 18, prefix: '+', suffix: '%', label: 'mAP@50 on-device YOLOv8' },
];

export default function WhyWorkWithMe() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      root.style.opacity = '1';
      root.style.transform = 'none';
      return;
    }

    // Section fade + rise
    gsap.fromTo(
      root,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      }
    );

    // Stats count-up once visible
    ScrollTrigger.create({
      trigger: root.querySelector('.why-stats') as Element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        root.querySelectorAll<HTMLElement>('[data-count]')?.forEach((el) => {
          const target = Number(el.dataset.count || '0');
          const decimals = Number(el.dataset.decimals || '0');
          const prefix = el.dataset.prefix ?? '';
          const suffix = el.dataset.suffix ?? '';
          const obj = { n: 0 } as { n: number };
          gsap.to(obj, {
            n: target,
            duration: 0.8,
            ease: 'power1.out',
            onUpdate: () => {
              const value = decimals > 0 ? obj.n.toFixed(decimals) : String(Math.round(obj.n));
              el.innerText = `${prefix ?? ''}${value}${suffix ?? ''}`;
            },
          });
        });
      },
    });
  }, []);

  return (
    <section ref={rootRef as any} aria-label="Why Work With Me" className="py-24">
      <div className="mx-auto w-full max-w-[1200px] px-[var(--space-24)]">
        <Card className="will-change-transform">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight">Why work with me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-white/80 max-w-[68ch]">
              I ship measurable outcomes faster paths to reliable, understandable AI systems.
            </p>

            {/* Proof strip */}
            <div className="why-stats mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
              {STATS.map((s, idx) => (
                <div key={idx} className="rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.04)] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <div className="text-xl font-semibold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#49D0C1,#9be8df)' }}>
                    <span
                      data-count={s.target}
                      data-decimals={s.decimals ?? 0}
                      data-prefix={s.prefix ?? ''}
                      data-suffix={s.suffix ?? ''}
                    >
                      0
                    </span>
                  </div>
                  <div className="text-sm text-white/60">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Receipts */}
            <ul className="mt-8 space-y-2 text-base text-white/80">
              <li>Reduce cold-start impact with provisioned concurrency and warm pools.</li>
              <li>Expose SLIs that feed SLO burn alerts issues are visible before users feel them.</li>
              <li>Ship operator UIs that explain model behavior for faster decisions.</li>
            </ul>

            {/* Trust chips */}
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {['AWS SAA-C03','FastAPI/Lambda','Cloud Run','Next.js'].map((chip) => (
                <span key={chip} className="chip" data-interactive>{chip}</span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/software-dev" className="group inline-flex items-center justify-center rounded-[var(--radius)] px-5 py-3 bg-[#49D0C1] text-black font-medium transition-transform duration-200 hover:-translate-y-0.5">
                <span>See how I build</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a href="/projects" className="inline-flex items-center justify-center rounded-[var(--radius)] px-5 py-3 border border-[rgba(255,255,255,0.12)] text-white/90 transition-transform duration-200 hover:-translate-y-0.5">
                View projects
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


