import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import type { PhotoItem, LocalPhotoMetadata, ExifInfo } from '@/types/photos';

export const runtime = 'nodejs';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function toPublicUrl(absolutePath: string, publicDir: string) {
  const relative = path.relative(publicDir, absolutePath);
  return '/' + relative.split(path.sep).join('/');
}

async function readFolderLevelMetadata(dir: string): Promise<Record<string, LocalPhotoMetadata>> {
  try {
    const metaPath = path.join(dir, 'metadata.json');
    const data = await fs.readFile(metaPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function listImagesInDirectory(dir: string, publicDir: string): Promise<PhotoItem[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const folderMeta = await readFolderLevelMetadata(dir);

  const photos: PhotoItem[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Skip nested directories; API will call per-album or top-level orchestrator handles one level deep
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) {
      continue;
    }

    const absolute = path.join(dir, entry.name);
    const base = entry.name.replace(/\.[^/.]+$/, '');
    const id = base;

    // Prefer sidecar <filename>.json, fallback to folder-level metadata.json mapping
    let sidecar: LocalPhotoMetadata = {};
    try {
      const sidecarPath = path.join(dir, `${base}.json`);
      const json = await fs.readFile(sidecarPath, 'utf8');
      sidecar = JSON.parse(json);
    } catch {
      sidecar = folderMeta[entry.name] || folderMeta[base] || {};
    }

    const imageUrl = toPublicUrl(absolute, publicDir);
    const title = sidecar.title || base;
    const description = sidecar.description || '';

    const exif: ExifInfo | undefined = sidecar.exif
      ? {
          camera: sidecar.exif.camera || 'Unknown Camera',
          lens: sidecar.exif.lens || 'Unknown Lens',
          settings: sidecar.exif.settings || 'Unknown Settings',
          date: sidecar.exif.date || '',
        }
      : undefined;

    photos.push({
      id,
      title,
      description,
      imageUrl,
      thumbnailUrl: imageUrl,
      ...(exif ? { exif } : {}),
    });
  }

  return photos;
}

async function listAlbums(rootPhotosDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(rootPhotosDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const album = url.searchParams.get('album') || '';

    // Resolve absolute path to public/photos
    const projectRoot = process.cwd();
    const publicDir = path.join(projectRoot, 'public');
    const photosRoot = path.join(publicDir, 'photos');

    // Ensure photos root exists
    try {
      await fs.access(photosRoot);
    } catch {
      return NextResponse.json({ mediaItems: [] as PhotoItem[] }, { status: 200 });
    }

    let items: PhotoItem[] = [];

    if (album) {
      const albumDir = path.join(photosRoot, album);
      try {
        const stats = await fs.stat(albumDir);
        if (stats.isDirectory()) {
          items = await listImagesInDirectory(albumDir, publicDir);
        }
      } catch {
        // Album not found; return empty
      }
    } else {
      // Aggregate images from each top-level album directory
      const albums = await listAlbums(photosRoot);
      for (const a of albums) {
        const albumDir = path.join(photosRoot, a);
        const albumItems = await listImagesInDirectory(albumDir, publicDir);
        // Prefix ids with album for uniqueness across albums
        items.push(
          ...albumItems.map((p) => ({
            ...p,
            id: `${a}/${p.id}`,
          }))
        );
      }
      // Also include any images directly under photosRoot (optional)
      const rootImages = await listImagesInDirectory(photosRoot, publicDir);
      items.push(...rootImages.map((p) => ({ ...p, id: p.id })));
    }

    return NextResponse.json({ mediaItems: items }, { status: 200 });
  } catch (error) {
    console.error('Local photos API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


