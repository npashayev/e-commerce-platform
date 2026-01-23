import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { apiRateLimiter, authRateLimiter } from './lib/upstash/rateLimit';

// Routes that require admin/moderator role
const adminRoutes = ['/admin'];

// Allowed origins for CORS
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL || 'https://e-commerce-platform-eight-snowy.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin');

  // Get identifier for rate limiting
  const identifier = req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'anonymous';

  // Handle CORS and Rate Limiting for API routes
  if (pathname.startsWith('/api')) {
    // Choose rate limiter based on endpoint
    const rateLimiter = pathname.startsWith('/api/auth')
      ? authRateLimiter
      : apiRateLimiter;

    // Check rate limit
    const { success, limit, reset, remaining } = await rateLimiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : '',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Set CORS headers for actual API requests
    const response = NextResponse.next();
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    // Add rate limit info to response headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  }

  // Authentication/Authorization logic for protected routes
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isCartRoute = pathname.startsWith('/me/cart');

  if (!isAdminRoute && !isCartRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    if (token.role !== 'admin' && token.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/me/cart/:path*',
    '/me/cart',
  ],
};