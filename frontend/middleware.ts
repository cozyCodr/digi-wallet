// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.COOKIE_NAME || ""

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/_next/static', // Next.js static files
  '/_next/image',  // Next.js image optimization
  '/public',       // Public assets
  '/favicon.ico',  // Favicon
];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const { pathname } = request.nextUrl;
  const authCookie = cookieStore.get(COOKIE_NAME);

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(publicPath =>
    pathname.startsWith(publicPath)
  );

  // Allow public paths and static files
  if (isPublicPath) {
    if (authCookie && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // Redirect to login if no auth cookie
  if (!authCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}