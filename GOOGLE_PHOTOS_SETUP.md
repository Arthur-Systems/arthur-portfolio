# Google Photos API Setup Guide

This guide will help you set up Google Photos API integration for your photography page.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Photos account with photos in an album
3. Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Photos Library API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Photos Library API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add your domain to "Authorized JavaScript origins":
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Save the Client ID and Client Secret

## Step 3: Get Refresh Token

You'll need to get a refresh token to access the Google Photos API. Here's how:

1. Use the OAuth 2.0 Playground:
   - Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Click the gear icon (⚙️) in the top right
   - Check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret

2. Authorize the API:
   - In the left panel, find "Google Photos Library API v1"
   - Select `https://www.googleapis.com/auth/photoslibrary.readonly`
   - Click "Authorize APIs"
   - Sign in with your Google account
   - Click "Exchange authorization code for tokens"
   - Copy the "Refresh token"

## Step 4: Create a Google Photos Album

1. Go to [Google Photos](https://photos.google.com/)
2. Create a new album or select an existing one
3. Add photos to the album
4. Get the album ID:
   - Open the album in Google Photos
   - Look at the URL: `https://photos.google.com/album/ALBUM_ID_HERE`
   - Copy the `ALBUM_ID_HERE` part

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google Photos API Configuration
GOOGLE_PHOTOS_CLIENT_ID=your_client_id_here
GOOGLE_PHOTOS_CLIENT_SECRET=your_client_secret_here
GOOGLE_PHOTOS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_PHOTOS_ALBUM_ID=your_album_id_here

# Public environment variable (accessible in browser)
NEXT_PUBLIC_GOOGLE_PHOTOS_ALBUM_ID=your_album_id_here

# Optional: Cache duration in seconds (default: 3600 = 1 hour)
GOOGLE_PHOTOS_CACHE_DURATION=3600
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/photography`
3. The page should load photos from your Google Photos album
4. If there are any errors, check the browser console and server logs

## Troubleshooting

### Common Issues

1. **"Failed to authenticate with Google Photos"**
   - Check that your Client ID and Client Secret are correct
   - Verify that the Google Photos Library API is enabled
   - Ensure your refresh token is valid

2. **"Failed to fetch photos from Google Photos"**
   - Verify the album ID is correct
   - Check that the album contains photos
   - Ensure the refresh token has the correct scopes

3. **"Album ID is required"**
   - Make sure `NEXT_PUBLIC_GOOGLE_PHOTOS_ALBUM_ID` is set in your environment variables

### API Limits

- Google Photos API has rate limits
- The default implementation includes caching to reduce API calls
- Consider implementing additional caching strategies for production

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive credentials
- Consider using a more secure authentication flow for production applications
- Regularly rotate your refresh tokens

## Production Considerations

- Use a proper OAuth flow instead of refresh tokens for production
- Implement proper error handling and user feedback
- Consider using a CDN for image optimization
- Implement proper caching strategies
- Add monitoring and logging for API usage
