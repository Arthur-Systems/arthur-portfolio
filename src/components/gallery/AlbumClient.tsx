'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AlbumManifest } from '@/lib/gallery';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { Lightbox } from '@/components/gallery/Lightbox';

const PAGE_SIZE = 48;

export function AlbumClient({ manifest }: { manifest: AlbumManifest }) {
  const photos = manifest.photos;
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = useMemo(() => photos.slice(0, page * PAGE_SIZE), [photos, page]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setPage((p) => (p * PAGE_SIZE < photos.length ? p + 1 : p));
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [photos.length]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const next = () => setLightboxIndex((i) => (i == null ? i : Math.min(i + 1, photos.length - 1)));
  const prev = () => setLightboxIndex((i) => (i == null ? i : Math.max(i - 1, 0)));

  return (
    <div>
      <div className="[column-fill:_balance]_sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {visible.map((p, idx) => (
          <div key={p.id} className="break-inside-avoid">
            <PhotoCard src={p.thumb.url} alt={p.filename} width={p.thumb.w} height={p.thumb.h} lqip={p.thumb.lqip} onClick={() => openLightbox(idx)} />
          </div>
        ))}
      </div>
      <div ref={loadMoreRef} className="h-10" />
      {lightboxIndex != null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          albumTitle={manifest.title}
          albumSlug={manifest.slug}
          onClose={closeLightbox}
          onNext={next}
          onPrev={prev}
          onSelect={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  );
}


