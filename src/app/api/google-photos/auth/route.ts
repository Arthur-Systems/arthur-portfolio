import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_PHOTOS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_PHOTOS_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_PHOTOS_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json(
        { error: 'Google Photos API credentials not configured' },
        { status: 500 }
      );
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token refresh failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to refresh access token' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    
    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
