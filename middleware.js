import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  const franchiseToken = request.cookies.get('franchise-auth-token')?.value;
  const agentToken = request.cookies.get('agent-auth-token')?.value;
  const vendorToken = request.cookies.get('vendor-auth-token')?.value;
  
  // Protect dashboard routes - only full admin token can access /dashboard; partners are routed to their own portals
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      if (agentToken) {
        return NextResponse.redirect(new URL('/agent/dashboard', request.url));
      }
      if (franchiseToken) {
        return NextResponse.redirect(new URL('/franchise/dashboard', request.url));
      }
      if (vendorToken) {
        return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
      }
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

  if (request.nextUrl.pathname.startsWith('/agent/login') && agentToken) {
    return NextResponse.redirect(new URL('/agent/dashboard', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/agent/dashboard')) {
    if (!agentToken) {
      return NextResponse.redirect(new URL('/agent/login', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/vendor/dashboard') && !vendorToken) {
    return NextResponse.redirect(new URL('/vendor/login', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/vendor/login') && vendorToken) {
    return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/franchise/login',
    '/franchise/dashboard/:path*',
    '/agent/login',
    '/agent/dashboard/:path*',
    '/vendor/login',
    '/vendor/dashboard/:path*',
  ],
};
