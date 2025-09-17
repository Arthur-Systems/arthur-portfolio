# Local Photos Setup Guide

This project now uses a simple local filesystem convention for the photography gallery. No external APIs or credentials are required.

## Folder standard

- Root folder: `public/photos/`
- Optional albums are subfolders under `public/photos/<album>/`
- Supported image types: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Optional metadata:
  - Sidecar per image: `photo-name.json` next to `photo-name.jpg`
  - Or a folder-level `metadata.json` mapping filenames to metadata

## Sidecar JSON shape

```json
{
  "title": "Sunset at the Bay",
  "description": "Golden hour over the water",
  "exif": {
    "camera": "Canon R5",
    "lens": "24-70mm f/2.8",
    "settings": "f/8, 1/125s, ISO 100",
    "date": "2024-08-20"
  }
}
```

## Folder-level metadata.json

Place a `metadata.json` inside an album folder. Keys can be the full filename (`"IMG_1234.jpg"`) or the basename (`"IMG_1234"`).

```json
{
  "IMG_1234.jpg": {
    "title": "City Skyline",
    "description": "Dusk from the bridge"
  },
  "portrait_01": {
    "title": "Portrait",
    "exif": { "camera": "Sony A7III" }
  }
}
```

## API

- List all photos (across albums and root): `GET /api/photos`
- List photos in an album: `GET /api/photos?album=<albumName>`

The API returns `{ mediaItems: PhotoItem[] }` where each item has:

```ts
type PhotoItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Servable path under /public
  thumbnailUrl: string; // Currently same as imageUrl
  exif?: {
    camera: string;
    lens: string;
    settings: string;
    date: string;
  };
}
```

## Adding photos

1. Create `public/photos/` if it does not exist.
2. Optionally create an album folder, e.g., `public/photos/portraits/`.
3. Drop your images into the folder(s).
4. Optionally add sidecar `*.json` or a `metadata.json` for titles/EXIF.
5. Visit `/photography` — the gallery will load from local files.

That’s it.
- Use a proper OAuth flow instead of refresh tokens for production
- Implement proper error handling and user feedback
- Consider using a CDN for image optimization
- Implement proper caching strategies
- Add monitoring and logging for API usage
