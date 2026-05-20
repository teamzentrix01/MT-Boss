import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};