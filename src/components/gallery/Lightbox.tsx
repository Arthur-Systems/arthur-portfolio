"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { AlbumPhoto } from '@/lib/gallery';

export interface LightboxProps {
  photo: AlbumPhoto;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ photo: p, onClose, onNext, onPrev }: LightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  const download = () => {
    const a = document.createElement('a');
    a.href = p.full.url;
    a.download = p.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div ref={backdropRef} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Image lightbox" onClick={onClose}>
      <div className="relative max-w-6xl w-full max-h-[90vh] bg-card rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-black/60 text-white text-sm" onClick={onPrev} aria-label="Previous">←</button>
            <button className="px-3 py-1 rounded bg-black/60 text-white text-sm" onClick={onNext} aria-label="Next">→</button>
          </div>
          <div className="flex items-center gap-2">
            <a className="px-3 py-1 rounded bg-black/60 text-white text-sm" href={p.full.url} target="_blank" rel="noreferrer" aria-label="Open original">Open</a>
            <button className="px-3 py-1 rounded bg-black/60 text-white text-sm" onClick={download} aria-label="Download">Download</button>
            <button className="px-3 py-1 rounded bg-black/60 text-white text-sm" onClick={() => navigator.clipboard.writeText(window.location.href)} aria-label="Copy link">Copy link</button>
            <button className="px-3 py-1 rounded bg-black/60 text-white text-sm" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4 h-full">
          <div className="col-span-2 bg-black flex items-center justify-center">
            <Image src={p.full.url} alt={p.filename} width={p.full.w} height={p.full.h} sizes="100vw" className="object-contain w-full h-full" />
          </div>
          <div className="col-span-1 p-4 overflow-y-auto bg-card text-sm text-foreground">
            <div className="font-semibold mb-2">{p.filename}</div>
            <div className="grid grid-cols-2 gap-2">
              <Info label="Camera" value={p.exif.camera} />
              <Info label="Lens" value={p.exif.lens} />
              <Info label="Focal length" value={p.exif.focalLength ? `${p.exif.focalLength} mm` : null} />
              <Info label="Aperture" value={p.exif.aperture ? `f/${p.exif.aperture}` : null} />
              <Info label="Shutter" value={p.exif.shutter} />
              <Info label="ISO" value={p.exif.iso?.toString() ?? null} />
              <Info label="Captured" value={p.exif.datetime ? new Date(p.exif.datetime).toLocaleString() : null} />
              <Info label="Dimensions" value={`${p.full.w}×${p.full.h}`} />
              <Info label="File size" value={`${(p.full.bytes / (1024 * 1024)).toFixed(2)} MB`} />
              {p.exif.gps && (
                <a href={`https://www.google.com/maps?q=${p.exif.gps.lat},${p.exif.gps.lng}`} target="_blank" rel="noreferrer" className="underline text-blue-600">
                  View on Map
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value ?? '—'}</div>
    </div>
  );
}
