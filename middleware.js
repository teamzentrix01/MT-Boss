import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  const franchiseToken = request.cookies.get('franchise-auth-token')?.value;
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/franchise/dashboard')) {
    if (!franchiseToken) {
      return NextResponse.redirect(new URL('/franchise/login', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/franchise/login') && franchiseToken) {
    return NextResponse.redirect(new URL('/franchise/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/franchise/login', '/franchise/dashboard/:path*'],
};
