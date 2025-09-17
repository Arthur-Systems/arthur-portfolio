import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { AlbumManifest } from '@/lib/gallery';
import Link from 'next/link';
import { AlbumClient } from '@/components/gallery/AlbumClient';

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

export default async function AlbumPage({ params }: { params: { album: string } }) {
  const manifest = await readManifest(params.album);
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
          <h1 className="text-3xl font-bold">{manifest.title || params.album}</h1>
        </div>
        <div />
      </div>
      <AlbumClient manifest={manifest} />
    </div>
  );
}


