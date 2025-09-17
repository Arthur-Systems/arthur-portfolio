"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import NextImage from 'next/image';
import type { AlbumPhoto } from '@/lib/gallery';
import { gsap } from '@/lib/gsapTimelines';

export interface LightboxProps {
  photos: AlbumPhoto[];
  index: number;
  albumTitle: string;
  albumSlug: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
}

export function Lightbox({ photos, index, albumTitle, albumSlug, onClose, onNext, onPrev, onSelect }: LightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(index);
  const photo = photos[i];
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const idleTimer = useRef<number | null>(null);
  const [hudVisible, setHudVisible] = useState(true);
  const [fullReady, setFullReady] = useState(false);

  useEffect(() => setI(index), [index]);

  // Guard against out-of-range index
  if (!photo) return null;

  // Prevent page scroll while lightbox is open
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => { html.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { setI((v) => Math.min(v + 1, photos.length - 1)); onNext(); }
      if (e.key === 'ArrowLeft') { setI((v) => Math.max(v - 1, 0)); onPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev, photos.length]);

  useEffect(() => {
    if (!rootRef.current) return;
    if (reduced) return;
    if (!fullReady) return;
    const root = rootRef.current;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(root.querySelector('.lb-backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.35 })
      .fromTo(root.querySelector('.lb-stage'), { scale: 0.98, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45 }, '<')
      .fromTo(root.querySelector('.lb-info'), { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }, '<0.05');
  }, [reduced, i, fullReady]);

  const scheduleIdle = () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    setHudVisible(true);
    idleTimer.current = window.setTimeout(() => setHudVisible(false), 1200);
  };

  useEffect(() => {
    scheduleIdle();
    return () => { if (idleTimer.current) window.clearTimeout(idleTimer.current); };
  }, [i]);

  // Reset fullReady on index change to preload next image and reveal when ready
  useEffect(() => { setFullReady(false); }, [i]);

  const download = () => {
    const a = document.createElement('a');
    a.href = photo.full.url;
    a.download = photo.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('photo', photo.id);
    await navigator.clipboard.writeText(url.toString());
  };

  const activeClass = hudVisible ? 'opacity-100' : 'opacity-30';

  // Preload neighbors
  useEffect(() => {
    const preload = async (p?: AlbumPhoto) => {
      if (!p) return;
      try { await fetch(p.full.url, { method: 'GET' }); } catch {}
    };
    preload(photos[i + 1]);
    preload(photos[i - 1]);
  }, [i, photos]);

  const filmstrip = useMemo(() => photos.map((p, idx) => (
    <button
      key={p.id}
      aria-current={idx === i ? 'true' : undefined}
      onClick={() => { setI(idx); onSelect(idx); }}
      className="shrink-0 snap-center relative w-28 aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-white/20 ring-2 ring-transparent aria-[current=true]:ring-teal-400/70 transition-transform duration-150 hover:scale-[1.02]"
      aria-label={`Go to image ${idx + 1}`}
    >
      <NextImage src={p.thumb.url} alt={p.filename} width={p.thumb.w} height={p.thumb.h} className="h-full w-full object-cover" />
    </button>
  )), [photos, i, onSelect]);

  return (
    <div
      ref={rootRef}
      className="lb fixed inset-0 z-50 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-background"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-title"
      onMouseMove={scheduleIdle}
      onClick={onClose}
    >
      {/* Top bar (row 1) */}
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 py-2" onClick={(e) => e.stopPropagation()}>
        <div className={`lb-topbar ${activeClass} h-12 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 text-white/80 shadow-[0_10px_30px_rgba(0,0,0,.35)]`}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-sm text-white/70 truncate">{photo.filename}</span>
            <span className="h-5 w-px bg-white/10" />
            <a href={`/gallery/${albumSlug}`} className="text-sm text-white/80 hover:text-white">{albumTitle}</a>
          </div>
          <div className="flex items-center gap-2">
            <a href={photo.full.url} target="_blank" rel="noreferrer" className="lb-action h-8 px-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">Open</a>
            <button onClick={download} className="lb-action h-8 px-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">Download</button>
            <button onClick={onClose} className="lb-action h-8 px-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">Close</button>
          </div>
        </div>
      </div>

      {/* Stage + Info (row 2) */}
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 min-w-0 min-h-0" onClick={(e) => e.stopPropagation()}>
        <div className={`grid h-[calc(100dvh-12rem)] min-h-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(320px,28vw)] ${fullReady ? '' : 'opacity-0 pointer-events-none'}`}>
        {/* Nav controls */}
          

        {/* Image stage */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,.35)] min-w-0 min-h-0 overflow-hidden transition hover:bg-black/10">
          <div
            ref={stageRef}
            className="lb-photo absolute inset-0"
            role="img"
            aria-label={`Image ${i + 1} of ${photos.length}`}
            style={{ cursor: 'default' }}
          >
            {fullReady && (
              <NextImage
                src={photo.full.url}
                alt={photo.filename}
                width={photo.full.w}
                height={photo.full.h}
                className="pointer-events-none select-none object-contain"
                style={{ position: 'absolute', inset: 0, margin: 'auto', maxHeight: '100%', maxWidth: '100%' }}
                sizes="100vw"
                priority
              />
            )}
            {/* Preload full-res and reveal stage only when decoded to avoid partial renders */}
            <FullSwap src={photo.full.url} onReady={() => setFullReady(true)} />
            {/* Nav buttons inside stage */}
            <button className={`lb-prev ${activeClass} absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 hover:bg-black/55 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70`} onClick={() => { setI(Math.max(0, i - 1)); onPrev(); }} aria-label="Previous">←</button>
            <button className={`lb-next ${activeClass} absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 hover:bg-black/55 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70`} onClick={() => { setI(Math.min(photos.length - 1, i + 1)); onNext(); }} aria-label="Next">→</button>
          </div>
        </div>

        {/* Info panel */}
        <aside className="lb-info rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,.35)] p-4 md:p-5 text-white/70 min-w-0 min-h-0 overflow-y-auto no-scrollbar">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 id="photo-title" className="text-xl font-semibold text-white/90 truncate">{photo.filename}</h2>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <K label="Camera" value={photo.exif.camera} />
            <K label="Lens" value={photo.exif.lens} />
            <K label="Focal" value={photo.exif.focalLength ? `${photo.exif.focalLength}mm` : null} />
            <K label="Aperture" value={photo.exif.aperture ? `f/${photo.exif.aperture}` : null} />
            <K label="Shutter" value={photo.exif.shutter} />
            <K label="ISO" value={photo.exif.iso?.toString() ?? null} />
            <K label="Dimensions" value={`${photo.full.w}×${photo.full.h}`} />
            <K label="Size" value={`${(photo.full.bytes / (1024 * 1024)).toFixed(2)} MB`} />
            <K label="Captured" value={photo.exif.datetime ? new Date(photo.exif.datetime).toLocaleString() : null} />
            {photo.exif.gps && (
              <div className="col-span-2">
                <a className="text-sm underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${photo.exif.gps.lat},${photo.exif.gps.lng}`}>Open map</a>
              </div>
            )}
          </div>
          
        </aside>

        </div>
      </div>

      {/* Filmstrip (row 3) */}
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="lb-strip rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,.35)] overflow-x-auto overflow-y-hidden no-scrollbar px-3 py-2 flex gap-3 snap-x snap-mandatory [mask-image:linear-gradient(90deg,transparent,white_10%,white_90%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,white_10%,white_90%,transparent)]">
            {filmstrip}
          </div>
      </div>
    </div>
  );
}

function FullSwap({ src, onReady }: { src: string; onReady: () => void }) {
  useEffect(() => {
    let active = true;
    const preload = new window.Image();
    preload.onload = () => { if (active) { onReady(); } };
    preload.onerror = () => { if (active) { onReady(); } };
    preload.src = src;
    return () => { active = false; };
  }, [src, onReady]);
  return null;
}

function K({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="lb-k text-sm text-white/55">{label}</div>
      <div className="lb-v text-base text-white/80 break-words">{value ?? '—'}</div>
    </div>
  );
}
