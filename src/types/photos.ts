export interface ExifInfo {
  camera: string;
  lens: string;
  settings: string;
  date: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  exif?: ExifInfo;
}

// Optional metadata sidecar file format for local photos
export interface LocalPhotoMetadata {
  title?: string;
  description?: string;
  exif?: Partial<ExifInfo>;
}

export type { PhotoItem as DefaultPhotoItem };


