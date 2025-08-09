'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLoader } from '@/state/useLoader';

export default function LoadingOverlay() {
  const { isLoading, progress, status } = useLoader();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Mount visibility + fade/scale transitions
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      // Smooth fade out after progress reaches 100% handled by provider timing
      const t = setTimeout(() => setVisible(false), reduced ? 120 : 240);
      return () => clearTimeout(t);
    }
  }, [isLoading, reduced]);

  // Animate progress width and label changes without heavy libs
  useEffect(() => {
    const el = progressRef.current;
    const label = percentRef.current;
    if (!el || !label) return;
    const pct = Math.max(0, Math.min(100, Math.round(progress)));
    el.style.width = `${pct}%`;
    label.textContent = `${pct}%`;
  }, [progress]);

  // Focus trap: keep focus inside the dialog while loading
  useEffect(() => {
    if (!isLoading) return;
    const card = cardRef.current;
    if (!card) return;
    const focusable = () => Array.from(card.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    // Focus the dialog
    const prev = document.activeElement as HTMLElement | null;
    card.setAttribute('tabindex', '-1');
    card.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = focusable();
      if (els.length === 0) {
        e.preventDefault();
        card.focus();
        return;
      }
      const first = els[0]!;
      const last = els[els.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prev?.focus?.();
    };
  }, [isLoading]);

  const canPortal = useMemo(() => typeof document !== 'undefined', []);
  if (!mounted || !visible) return null;

  const overlay = (
    <div
      className={[
        'fixed inset-0 z-[10000] flex items-center justify-center',
        'backdrop-blur-md bg-black/30',
        'transition-opacity duration-200',
        isLoading ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      aria-hidden={!visible}
      aria-live="polite"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Application loading"
        ref={cardRef}
        className={[
          'pointer-events-auto',
          'w-[min(92vw,520px)] rounded-2xl',
          'bg-neutral-900 text-neutral-100 shadow-2xl border border-white/10',
          'px-6 py-5',
          'transition-all',
          reduced ? 'duration-150' : 'duration-300',
          isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4z" stroke="url(#g)" strokeWidth="1.5" fill="transparent" />
          </svg>
          <div className="text-sm uppercase tracking-wider text-neutral-300">Arthur • Sync</div>
          <div className="ml-auto text-xs text-neutral-400" aria-live="polite">Loading</div>
        </div>

        {/* Big percent */}
        <div className="mt-5">
          <div
            ref={percentRef}
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            0%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 rounded-full bg-neutral-800 overflow-hidden border border-white/5">
          <div
            ref={progressRef}
            className="h-full rounded-full bg-indigo-600 relative"
            style={{ width: '0%' }}
          >
            {/* Animated stripe */}
            {!reduced && (
              <div className="absolute inset-0 animate-[stripe_1.2s_linear_infinite] bg-[length:24px_24px] bg-[linear-gradient(45deg,rgba(255,255,255,0.12)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.12)_75%,transparent_75%,transparent)]" />
            )}
          </div>
        </div>

        {/* Status */}
        <p className="mt-3 text-[13px] text-neutral-400">{status}</p>
      </div>
    </div>
  );

  return canPortal ? createPortal(overlay, document.body) : overlay;
}


