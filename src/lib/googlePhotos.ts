// Google Photos API integration utilities

export interface GooglePhoto {
  id: string;
  baseUrl: string;
  mimeType: string;
  filename: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
      exposureTime?: string;
    };
  };
}

export interface GooglePhotosResponse {
  mediaItems: GooglePhoto[];
  nextPageToken?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  exif?: {
    camera: string;
    lens: string;
    settings: string;
    date: string;
  };
}

class GooglePhotosAPI {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Refresh the token
    const response = await fetch('/api/google-photos/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

    return this.accessToken!;
  }

  async getPhotosFromAlbum(albumId: string, pageSize: number = 25): Promise<PhotoItem[]> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`/api/google-photos/photos?albumId=${albumId}&pageSize=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const data: GooglePhotosResponse = await response.json();
      
      return data.mediaItems.map(this.transformPhoto);
    } catch (error) {
      console.error('Error fetching photos from Google Photos:', error);
      throw error;
    }
  }

  private transformPhoto(photo: GooglePhoto): PhotoItem {
    const { mediaMetadata } = photo;
    const photoData = mediaMetadata.photo;
    
    // Generate different sizes for the image URL
    const baseUrl = photo.baseUrl;
    const imageUrl = `${baseUrl}=w2048-h2048`; // High quality
    const thumbnailUrl = `${baseUrl}=w400-h400`; // Thumbnail
    
    // Extract camera info
    const camera = photoData?.cameraMake && photoData?.cameraModel 
      ? `${photoData.cameraMake} ${photoData.cameraModel}`
      : 'Unknown Camera';
    
    const lens = photoData?.focalLength 
      ? `${photoData.focalLength}mm`
      : 'Unknown Lens';
    
    const settings = [
      photoData?.apertureFNumber && `f/${photoData.apertureFNumber}`,
      photoData?.exposureTime && `${photoData.exposureTime}s`,
      photoData?.isoEquivalent && `ISO ${photoData.isoEquivalent}`,
    ].filter(Boolean).join(', ') || 'Unknown Settings';
    
    const date = new Date(mediaMetadata.creationTime).toLocaleDateString();

    return {
      id: photo.id,
      title: photo.filename.replace(/\.[^/.]+$/, ''), // Remove file extension
      description: `Captured on ${date}`,
      imageUrl,
      thumbnailUrl,
      exif: {
        camera,
        lens,
        settings,
        date,
      },
    };
  }
}

export const googlePhotosAPI = new GooglePhotosAPI();
