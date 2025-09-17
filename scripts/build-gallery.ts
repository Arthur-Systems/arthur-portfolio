/*
  Build gallery manifests and image variants.
  - Scans: public/albums/<AlbumName>/*.{jpg,jpeg,png,webp,gif}
  - Outputs:
    - public/_gallery/albums.json
    - public/_gallery/<slug>.json
    - public/_gallery/<slug>/thumb/*.webp (longest edge 320)
    - public/_gallery/<slug>/preview/*.webp (longest edge 1024)
*/

import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import pLimit from 'p-limit';
import { exiftool } from 'exiftool-vendored';
import type { AlbumManifest, AlbumPhoto, GalleryAlbumSummary, PhotoExif } from '@/lib/gallery';
import { slugifyFolderName, titleFromFolderName, calcContainSize, toIso } from '@/lib/gallery';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const CONCURRENCY = Number(process.env.GALLERY_CONCURRENCY || 4);
const THUMB_LONGEST = 512;
const PREVIEW_LONGEST = 1280;

function isImage(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function encodePathSegment(name: string) {
  return encodeURIComponent(name).replace(/%2F/g, '/');
}

function formatShutter(exposureTime?: number | string | null): string | null {
  if (exposureTime == null) return null;
  if (typeof exposureTime === 'string') {
    // exiftool sometimes provides friendly strings already
    return exposureTime;
  }
  if (!Number.isFinite(exposureTime) || exposureTime <= 0) return null;
  if (exposureTime >= 1) {
    // 1s or longer
    return `${exposureTime.toFixed(1)}s`;
  }
  const denom = Math.round(1 / exposureTime);
  return `1/${denom}`;
}

function parseFocalLength(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const m = value.match(/([0-9]+(?:\.[0-9]+)?)\s*mm/i);
    if (m) return Number(m[1]);
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

async function readExif(filePath: string): Promise<PhotoExif> {
  try {
    const tags = await exiftool.read(filePath);
    const camera = (tags.Model as string) || (tags.Make ? `${tags.Make} ${tags.Model ?? ''}`.trim() : null) || null;
    const lens = (tags.LensModel as string) || (tags.Lens as string) || null;
    const focalLength = parseFocalLength(tags.FocalLength);
    const aperture = typeof tags.FNumber === 'number' ? tags.FNumber : (typeof tags.Aperture === 'number' ? tags.Aperture : null);
    const exposure = (tags.ExposureTime as number | string | undefined) ?? (tags.ShutterSpeed as string | undefined) ?? null;
    const shutter = formatShutter(exposure as number | string | null);
    const iso = (typeof tags.ISO === 'number' ? tags.ISO : null) ?? null;
    const dt = (tags.DateTimeOriginal as string) || (tags.CreateDate as string) || (tags.ModifyDate as string) || null;
    const datetime = toIso(dt);
    let gps: PhotoExif['gps'] = null;
    const lat = (tags.GPSLatitude as number | undefined) ?? undefined;
    const lng = (tags.GPSLongitude as number | undefined) ?? undefined;
    if (typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng)) {
      gps = { lat, lng };
    }
    return { camera, lens, focalLength, aperture, shutter, iso, datetime, gps };
  } catch {
    return { camera: null, lens: null, focalLength: null, aperture: null, shutter: null, iso: null, datetime: null, gps: null };
  }
}

async function generateVariant(
  originalPath: string,
  outPath: string,
  originalWidth: number,
  originalHeight: number,
  targetLongest: number,
  quality: number
): Promise<{ w: number; h: number }> {
  const { width: w, height: h } = calcContainSize(originalWidth, originalHeight, targetLongest);
  await ensureDir(path.dirname(outPath));
  // Skip if up-to-date
  try {
    const [srcStat, dstStat] = await Promise.all([fs.stat(originalPath), fs.stat(outPath)]);
    if (dstStat.mtimeMs >= srcStat.mtimeMs) {
      return { w, h };
    }
  } catch {
    // proceed to generate
  }

  const pipeline = sharp(originalPath).rotate();
  if (originalWidth >= originalHeight) {
    pipeline.resize({ width: w, withoutEnlargement: true, fit: 'inside' });
  } else {
    pipeline.resize({ height: h, withoutEnlargement: true, fit: 'inside' });
  }
  await pipeline.webp({ quality, effort: 4 }).toFile(outPath);
  return { w, h };
}

async function buildLqip(originalPath: string): Promise<string> {
  const buf = await sharp(originalPath)
    .rotate()
    .resize({ width: 16, height: 16, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 30, effort: 4 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function processAlbum(albumDirName: string, albumsRoot: string, outRoot: string): Promise<{ manifest: AlbumManifest; summary: GalleryAlbumSummary; coverBase: string | null }> {
  const albumDir = path.join(albumsRoot, albumDirName);
  const slug = slugifyFolderName(albumDirName);
  const title = titleFromFolderName(albumDirName);
  const outAlbumDir = path.join(outRoot, slug);
  const thumbDir = path.join(outAlbumDir, 'thumb');
  const previewDir = path.join(outAlbumDir, 'preview');
  await ensureDir(thumbDir);
  await ensureDir(previewDir);

  const entries = await fs.readdir(albumDir, { withFileTypes: true });
  const images = entries.filter((e) => e.isFile() && isImage(e.name)).map((e) => e.name);
  images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Determine cover preference
  const coverCandidate = images.find((n) => /^cover\./i.test(n)) || images[0] || null;

  const limit = pLimit(CONCURRENCY);
  const photos: AlbumPhoto[] = [];

  // Pre-read original stats in parallel
  const photoTasks = images.map((filename) => limit(async () => {
    const originalPath = path.join(albumDir, filename);
    const base = filename.replace(/\.[^/.]+$/, '');
    const id = base;
    const encodedAlbum = encodePathSegment(albumDirName);
    const fullUrl = `/${['albums', encodedAlbum, filename].join('/')}`;

    const [meta, stat] = await Promise.all([
      sharp(originalPath).metadata(),
      fs.stat(originalPath),
    ]);
    const originalWidth = meta.width || 0;
    const originalHeight = meta.height || 0;

    const thumbOut = path.join(thumbDir, `${base}.webp`);
    const previewOut = path.join(previewDir, `${base}.webp`);

    const [thumbSize, previewSize, lqip, exif] = await Promise.all([
      generateVariant(originalPath, thumbOut, originalWidth, originalHeight, THUMB_LONGEST, 72),
      generateVariant(originalPath, previewOut, originalWidth, originalHeight, PREVIEW_LONGEST, 82),
      buildLqip(originalPath),
      readExif(originalPath),
    ]);

    const photo: AlbumPhoto = {
      id,
      filename,
      thumb: { url: `/${path.posix.join('_gallery', slug, 'thumb', `${base}.webp`)}`, w: thumbSize.w, h: thumbSize.h, lqip },
      preview: { url: `/${path.posix.join('_gallery', slug, 'preview', `${base}.webp`)}`, w: previewSize.w, h: previewSize.h },
      full: { url: fullUrl, w: originalWidth, h: originalHeight, bytes: stat.size },
      exif,
    };
    photos.push(photo);
  }));

  await Promise.all(photoTasks);

  // Sort photos by capture date if available, else by filename
  photos.sort((a, b) => {
    const da = a.exif.datetime ? Date.parse(a.exif.datetime) : 0;
    const db = b.exif.datetime ? Date.parse(b.exif.datetime) : 0;
    if (da !== db) return da - db;
    return a.filename.localeCompare(b.filename, undefined, { numeric: true });
  });

  const latestCaptureISO = photos.reduce<string>((latest, p) => {
    const dt = p.exif.datetime ? p.exif.datetime : null;
    if (!dt) return latest;
    if (!latest) return dt;
    return Date.parse(dt) > Date.parse(latest) ? dt : latest;
  }, '');

  const coverBase = coverCandidate ? coverCandidate.replace(/\.[^/.]+$/, '') : null;
  const cover = coverBase ? `/${path.posix.join('_gallery', slug, 'preview', `${coverBase}.webp`)}` : `/${path.posix.join('_gallery', slug, 'preview', `${photos[0]?.id || 'cover'}.webp`)}`;

  const manifest: AlbumManifest = { slug, title, photos };
  const summary: GalleryAlbumSummary = {
    slug,
    title,
    cover,
    count: photos.length,
    latestCaptureISO: latestCaptureISO || new Date().toISOString(),
  };

  return { manifest, summary, coverBase };
}

async function main() {
  const projectRoot = process.cwd();
  const publicDir = path.join(projectRoot, 'public');
  const albumsRoot = path.join(publicDir, 'albums');
  const outRoot = path.join(publicDir, '_gallery');

  await ensureDir(outRoot);
  // Ensure albums root exists
  try {
    await fs.access(albumsRoot);
  } catch {
    await ensureDir(albumsRoot);
  }

  const dirents = await fs.readdir(albumsRoot, { withFileTypes: true });
  const albumDirs = dirents.filter((d) => d.isDirectory()).map((d) => d.name);

  const results = await Promise.all(albumDirs.map((name) => processAlbum(name, albumsRoot, outRoot)));

  // Write album manifests and collect summaries
  const summaries: GalleryAlbumSummary[] = [];
  await Promise.all(
    results.map(async ({ manifest, summary }) => {
      const manifestPath = path.join(outRoot, `${manifest.slug}.json`);
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      summaries.push(summary);
    })
  );

  // Sort summaries by latestCaptureISO desc
  summaries.sort((a, b) => Date.parse(b.latestCaptureISO) - Date.parse(a.latestCaptureISO));
  const albumsListPath = path.join(outRoot, 'albums.json');
  await fs.writeFile(albumsListPath, JSON.stringify(summaries, null, 2), 'utf8');

  await exiftool.end();
  // eslint-disable-next-line no-console
  console.log(`Gallery build complete. Albums: ${summaries.length}`);
}

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('Gallery build failed:', err);
  try { await exiftool.end(); } catch {}
  process.exit(1);
});


