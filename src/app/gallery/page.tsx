import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import type { GalleryAlbumSummary } from '@/lib/gallery';

export const revalidate = 3600;

async function readAlbums(): Promise<GalleryAlbumSummary[]> {
  const projectRoot = process.cwd();
  const filePath = path.join(projectRoot, 'public', '_gallery', 'albums.json');
  try {
    const json = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(json) as unknown;
    return Array.isArray(data) ? (data as GalleryAlbumSummary[]) : [];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const albums = await readAlbums();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      {albums.length === 0 && (
        <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 p-3 text-yellow-800 text-sm">
          No albums found. Add images under <code>public/albums/&lt;AlbumName&gt;/</code> and run <code>npm run build:gallery</code>.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
          <Link key={album.slug} href={`/gallery/${album.slug}`} className="group block rounded-xl overflow-hidden border border-border bg-card shadow hover:shadow-lg transition-shadow">
            <div className="relative aspect-[4/3]">
              <Image
                src={album.cover}
                alt={`${album.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={false}
              />
              <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-black/60 text-white">{album.count} photos</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-lg group-hover:underline">{album.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(album.latestCaptureISO).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


