import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Handle subdomain routing
  const subdomain = hostname.split('.')[0] || '';
  
  // Map subdomains to routes
  const subdomainRoutes: Record<string, string> = {
    'photo': '/photography',
    'video': '/video', 
    'tech': '/tech',
  };
  
  // Check if this is a subdomain request
  if (subdomain && subdomainRoutes[subdomain]) {
    const targetPath = subdomainRoutes[subdomain]!;
    
    // If we're already on the correct path, don't redirect
    if (pathname === targetPath) {
      return NextResponse.next();
    }
    
    // Redirect subdomain to the correct route
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    
    // Add a response header to trigger scroll-to-top on client
    const response = NextResponse.redirect(url);
    response.headers.set('X-Scroll-To-Top', 'true');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 