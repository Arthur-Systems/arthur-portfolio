import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');
    const pageSize = parseInt(searchParams.get('pageSize') || '25');
    const pageToken = searchParams.get('pageToken');

    if (!albumId) {
      return NextResponse.json(
        { error: 'Album ID is required' },
        { status: 400 }
      );
    }

    // Get access token from the auth endpoint
    const authResponse = await fetch(`${request.nextUrl.origin}/api/google-photos/auth`, {
      method: 'POST',
    });

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to authenticate with Google Photos' },
        { status: 500 }
      );
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Fetch photos from the album
    const photosResponse = await fetch(
      `https://photoslibrary.googleapis.com/v1/albums/${albumId}/mediaItems?pageSize=${pageSize}${
        pageToken ? `&pageToken=${pageToken}` : ''
      }`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!photosResponse.ok) {
      const errorData = await photosResponse.text();
      console.error('Photos API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch photos from Google Photos' },
        { status: 500 }
      );
    }

    const photosData = await photosResponse.json();
    
    return NextResponse.json(photosData);
  } catch (error) {
    console.error('Photos API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
