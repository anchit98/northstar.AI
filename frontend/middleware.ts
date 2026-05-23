import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Passcode for v1 auth (DEC-20). In production, set this in Vercel environment variables.
const WORKBENCH_PASSCODE = process.env.WORKBENCH_PASSCODE || 'northstar-dev';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /workbench routes
  if (pathname.startsWith('/workbench')) {
    // Exclude the login/gate page itself if we have one, or handle auth via cookies
    const authCookie = request.cookies.get('workbench_auth');
    
    // If not authenticated and not already on the auth gate, redirect to auth gate
    if (authCookie?.value !== WORKBENCH_PASSCODE && pathname !== '/workbench/auth') {
      const url = request.nextUrl.clone();
      url.pathname = '/workbench/auth';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();

  if (pathname.startsWith('/workbench')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
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
