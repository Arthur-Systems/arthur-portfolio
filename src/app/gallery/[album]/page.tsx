import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { AlbumManifest } from '@/lib/gallery';
import Link from 'next/link';
import { AlbumClient } from '@/components/gallery/AlbumClient';
import type { Metadata } from 'next';

export const revalidate = 3600;

async function readManifest(slug: string): Promise<AlbumManifest | null> {
  const filePath = path.join(process.cwd(), 'public', '_gallery', `${slug}.json`);
  try {
    const json = await fs.readFile(filePath, 'utf8');
    return JSON.parse(json) as AlbumManifest;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', '_gallery');
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.json') && f !== 'albums.json')
      .map((f) => ({ album: f.replace(/\.json$/, '') }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ album: string }> }): Promise<Metadata> {
  const { album } = await params;
  const manifest = await readManifest(album);
  
  if (!manifest) {
    return {
      title: "Album Not Found",
      description: "The requested photography album could not be found.",
    };
  }

  const albumDescriptions: Record<string, string> = {
    raceday: "High-speed automotive photography capturing the energy and excitement of racing events. Dynamic shots of vehicles, drivers, and the racing atmosphere.",
    costumes: "Creative costume photography showcasing character design, fashion, and artistic expression through themed photography sessions.",
  };

  const description = albumDescriptions[album] || `Photography album: ${manifest.title}. ${manifest.photos.length} high-quality images.`;
  const coverPhoto = manifest.photos[0];

  return {
    title: `${manifest.title} | Photography Gallery`,
    description,
    keywords: ["photography", "gallery", manifest.title.toLowerCase(), "Arthur Wei", "photography portfolio"],
    openGraph: {
      title: `${manifest.title} | Haichuan Wei Photography`,
      description,
      type: "website",
      images: [
        {
          url: coverPhoto?.preview.url || coverPhoto?.thumb.url || "",
          width: coverPhoto?.preview.w || 400,
          height: coverPhoto?.preview.h || 300,
          alt: `${manifest.title} - Photography Album`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${manifest.title} | Haichuan Wei Photography`,
      description,
      images: [coverPhoto?.preview.url || coverPhoto?.thumb.url || ""],
    },
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album } = await params;
  const manifest = await readManifest(album);
  if (!manifest) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Back to albums"
          >
            <span className="text-lg leading-none">←</span>
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-3xl font-bold">{manifest.title || album}</h1>
        </div>
        <div />
      </div>
      <AlbumClient manifest={manifest} />
    </div>
  );
}


