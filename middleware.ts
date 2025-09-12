import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Derive subdomain robustly from Host header (handles ports, dev, and prod)
  const hostHeader = request.headers.get('host') || '';
  const hostNoPort = hostHeader.split(':')[0];
  const hostParts = hostNoPort.split('.');
  const isLocalhost = hostNoPort === 'localhost' || hostNoPort === '127.0.0.1';
  const subdomain = !isLocalhost && hostParts.length > 1 ? hostParts[0] : (hostParts.length === 2 && hostParts[1] === 'localhost' ? hostParts[0] : '');
  
  // Map subdomains to routes
  const subdomainRoutes: Record<string, string> = {
    'photo': '/photography',
    'video': '/video', 
    'tech': '/tech',
    'furry': '/furry',
  };
  
  // Check if this is a subdomain request
  if (subdomain && subdomainRoutes[subdomain]) {
    const targetPath = subdomainRoutes[subdomain]!;
    
    // If we're already on the correct path, don't redirect
    if (pathname === targetPath) {
      return NextResponse.next();
    }
    
    // Redirect or rewrite subdomain to the correct route
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    
    // For root path requests, prefer rewrite so URL stays on the subdomain root
    if (pathname === '/') {
      const response = NextResponse.rewrite(url);
      response.headers.set('X-Subdomain-Route', subdomain);
      return response;
    }
    
    // Otherwise, perform a redirect so the path visibly matches
    const response = NextResponse.redirect(url);
    response.headers.set('X-Scroll-To-Top', 'true');
    response.headers.set('X-Subdomain-Route', subdomain);
    return response;
  }

  // If user tries to access /furry without furry subdomain, 404
  if (pathname.startsWith('/furry') && subdomain !== 'furry') {
    return NextResponse.rewrite(new URL('/404', request.url));
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