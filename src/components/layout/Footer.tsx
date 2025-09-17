'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleBackToTop = () => {
    try {
      const el = document.getElementById('top');
      if (el) {
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        return;
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <footer role="contentinfo" className="mt-24 border-t border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.03)]/50">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 md:py-12">
        {/* Top area: 2 columns on md+; stacked on mobile */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
          {/* Brand + Tagline */}
          <div className="text-center md:text-left">
            <div className="text-lg font-semibold tracking-tight">Arthur Wei</div>
            <div className="mt-1 text-sm text-white/70">Building reliable AI systems.</div>
          </div>

          {/* Social + Direct */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            <a
              href="https://github.com/"
              aria-label="GitHub"
              className="group inline-flex h-9 items-center gap-2 rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.04)] px-3 text-white/85 transition-[transform,background-color] duration-200 hover:-translate-y-[1px] hover:bg-[rgb(255_255_255/0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
            >
              <Github className="h-[22px] w-[22px] text-white/80 transition-colors duration-200 group-hover:text-[color:#49D0C1]" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/"
              aria-label="LinkedIn"
              className="group inline-flex h-9 items-center gap-2 rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.04)] px-3 text-white/85 transition-[transform,background-color] duration-200 hover:-translate-y-[1px] hover:bg-[rgb(255_255_255/0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
            >
              <Linkedin className="h-[22px] w-[22px] text-white/80 transition-colors duration-200 group-hover:text-[color:#49D0C1]" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="mailto:arthur.wei50@gmail.com"
              aria-label="Email"
              className="group inline-flex h-9 items-center gap-2 rounded-[var(--radius)] border border-[rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.04)] px-3 text-white/85 transition-[transform,background-color] duration-200 hover:-translate-y-[1px] hover:bg-[rgb(255_255_255/0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
            >
              <Mail className="h-[22px] w-[22px] text-white/80 transition-colors duration-200 group-hover:text-[color:#49D0C1]" />
              <span className="sr-only">Email</span>
            </a>
            <span className="chip ml-1">Irvine, CA</span>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-4 text-[13px] text-white/60 md:flex-row">
          <div>© {year} Arthur Wei · All rights reserved.</div>
          {showTop && (
            <button
              type="button"
              onClick={handleBackToTop}
              className="group inline-flex h-9 items-center gap-2 rounded-[var(--radius)] border border-[color:#49D0C1] px-3 text-white/90 transition-transform duration-200 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
            >
              <span>Back to top</span>
              <ArrowUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}


