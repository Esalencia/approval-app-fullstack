// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/unauthorized',
    '/',
    '/about',
    '/communities',
    '/contacts',
    '/liber'
  ];

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith('/auth/reset-password/')
  );

  // Static files and API routes should be accessible
  const isStaticOrApi = pathname.startsWith('/_next') ||
                        pathname.startsWith('/api') ||
                        pathname.includes('.');

  // If not a public route or static/API route, and no token, redirect to login
  if (!isPublicRoute && !isStaticOrApi && !token) {
    // Store the original URL to redirect back after login
    const url = new URL('/auth/login', request.url);

    // Use encodeURIComponent for better handling of special characters
    const callbackUrl = request.nextUrl.href;
    console.log('Setting callback URL in middleware:', callbackUrl); // Debug log

    url.searchParams.set('callbackUrl', encodeURIComponent(callbackUrl));
    return NextResponse.redirect(url);
  }

  // Role-specific access control for authenticated users
  if (!isPublicRoute && !isStaticOrApi && token && role) {
    console.log('Checking role-based access for path:', pathname);
    console.log('User role from cookie:', role);

    // Normalize role to lowercase for case-insensitive comparison
    const normalizedRole = role.toLowerCase();

    // Admin routes - accessible by admins and superadmins
    if (pathname.startsWith('/admin') &&
        normalizedRole !== 'admin' &&
        normalizedRole !== 'superadmin') {
      console.log('Access denied to admin route');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Inspector routes - only accessible by inspectors
    if (pathname.startsWith('/inspector') && normalizedRole !== 'inspector') {
      console.log('Access denied to inspector route');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Applicant routes - only accessible by applicants
    if (pathname.startsWith('/applicant') && normalizedRole !== 'applicant') {
      console.log('Access denied to applicant route');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Generic dashboard route redirects to role-specific dashboard
    if (pathname === '/dashboard') {
      console.log('Redirecting from dashboard to role-specific dashboard');
      return NextResponse.redirect(new URL(`/${normalizedRole}`, request.url));
    }
  }

  return NextResponse.next();
}

// Add config to specify which paths this middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
