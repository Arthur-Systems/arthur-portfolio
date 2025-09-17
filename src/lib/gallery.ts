export interface GalleryAlbumSummary {
  slug: string;
  title: string;
  cover: string;
  count: number;
  latestCaptureISO: string; // ISO8601 string
}

export interface PhotoVariant {
  url: string;
  w: number;
  h: number;
  lqip?: string; // base64 data URL for low-quality placeholder
}

export interface PhotoFullVariant {
  url: string;
  w: number;
  h: number;
  bytes: number;
}

export interface PhotoGps {
  lat: number;
  lng: number;
}

export interface PhotoExif {
  camera: string | null;
  lens: string | null;
  focalLength: number | null; // millimeters
  aperture: number | null; // f-number
  shutter: string | null; // human-readable, e.g., "1/200"
  iso: number | null;
  datetime: string | null; // ISO8601
  gps?: PhotoGps | null;
}

export interface AlbumPhoto {
  id: string; // filename base without extension
  filename: string; // original filename with extension
  thumb: PhotoVariant;
  preview: PhotoVariant;
  full: PhotoFullVariant;
  exif: PhotoExif;
}

export interface AlbumManifest {
  slug: string;
  title: string;
  photos: AlbumPhoto[];
}

export function slugifyFolderName(folderName: string): string {
  return folderName
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');
}

export function titleFromFolderName(folderName: string): string {
  const cleaned = folderName
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function calcContainSize(
  originalWidth: number,
  originalHeight: number,
  targetLongestEdge: number
): { width: number; height: number } {
  if (originalWidth <= 0 || originalHeight <= 0) {
    return { width: targetLongestEdge, height: targetLongestEdge };
  }
  const isLandscape = originalWidth >= originalHeight;
  if (isLandscape) {
    const width = Math.min(targetLongestEdge, originalWidth);
    const height = Math.round((originalHeight * width) / originalWidth);
    return { width, height };
  } else {
    const height = Math.min(targetLongestEdge, originalHeight);
    const width = Math.round((originalWidth * height) / originalHeight);
    return { width, height };
  }
}

export function toIso(date: Date | string | number | null | undefined): string | null {
  try {
    if (!date) return null;
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}


