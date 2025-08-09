'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from '@/lib/gsapTimelines';

interface PhotoItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  exif?: {
    camera: string;
    lens: string;
    settings: string;
    date: string;
  };
}

const samplePhotos: PhotoItem[] = [
  {
    id: '1',
    title: 'Urban Landscape',
    description: 'City lights at dusk',
    imageUrl: '/api/placeholder/400/600',
    exif: {
      camera: 'Sony A7III',
      lens: '24-70mm f/2.8',
      settings: 'f/8, 1/60s, ISO 800',
      date: '2024-01-15',
    },
  },
  {
    id: '2',
    title: 'Mountain Vista',
    description: 'Sunrise over the peaks',
    imageUrl: '/api/placeholder/600/400',
    exif: {
      camera: 'Canon R5',
      lens: '16-35mm f/4',
      settings: 'f/11, 1/125s, ISO 100',
      date: '2024-02-20',
    },
  },
  {
    id: '3',
    title: 'Street Portrait',
    description: 'Candid moment in the city',
    imageUrl: '/api/placeholder/400/600',
    exif: {
      camera: 'Fujifilm X-T4',
      lens: '56mm f/1.2',
      settings: 'f/1.8, 1/250s, ISO 400',
      date: '2024-03-10',
    },
  },
  {
    id: '4',
    title: 'Abstract Nature',
    description: 'Patterns in the forest',
    imageUrl: '/api/placeholder/600/400',
    exif: {
      camera: 'Nikon Z7',
      lens: '105mm f/2.8',
      settings: 'f/4, 1/500s, ISO 200',
      date: '2024-04-05',
    },
  },
];

interface PhotoCardProps {
  photo: PhotoItem;
  onClick: (photo: PhotoItem) => void;
}

function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <div
      onClick={() => onClick(photo)}
      className="group cursor-pointer rounded-xl overflow-hidden shadow-lg bg-card border border-border hover:shadow-xl transition-all duration-300"
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[2/3] bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-lg font-medium">{photo.title}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
      </div>
    </div>
  );
}

interface PhotoLightboxProps {
  photo: PhotoItem | null;
  onClose: () => void;
}

function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (photo && lightboxRef.current) {
      // Animate lightbox opening
      gsap.from(lightboxRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'power3.out',
      });

      // Animate backdrop blur
      gsap.to('.lightbox-backdrop', {
        backdropFilter: 'blur(10px)',
        duration: 0.5,
      });
    }
  }, [photo]);

  const handleClose = () => {
    if (lightboxRef.current) {
      gsap.to(lightboxRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: onClose,
      });

      gsap.to('.lightbox-backdrop', {
        backdropFilter: 'blur(0px)',
        duration: 0.3,
      });
    }
  };

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lightbox-backdrop bg-black/80"
      onClick={handleClose}
    >
      <div
        ref={lightboxRef}
        className="relative max-w-4xl max-h-[90vh] bg-card rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          ×
        </button>

        {/* EXIF toggle button */}
        <button className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
          i
        </button>

        {/* Photo placeholder */}
        <div className="relative w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="w-96 h-64 bg-muted-foreground/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-muted-foreground">Photo: {photo.title}</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{photo.title}</h3>
            <p className="text-muted-foreground">{photo.description}</p>
          </div>
        </div>

        {/* EXIF info overlay */}
        {photo.exif && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Camera:</strong> {photo.exif.camera}
              </div>
              <div>
                <strong>Lens:</strong> {photo.exif.lens}
              </div>
              <div>
                <strong>Settings:</strong> {photo.exif.settings}
              </div>
              <div>
                <strong>Date:</strong> {photo.exif.date}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const handlePhotoSelect = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePhotos.map((p) => (
          <PhotoCard key={p.id} photo={p} onClick={handlePhotoSelect} />
        ))}
      </div>
      <PhotoLightbox photo={selectedPhoto} onClose={handleCloseLightbox} />
    </div>
  );
}