import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Routes that require admin/moderator role
const adminRoutes = ['/admin'];

// Routes that require authentication only (any logged-in user)
const userRoutes = ['/cart'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the JWT token from the request
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if this is an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if this is the cart route (matches /me/cart pattern)
  const isCartRoute = pathname.startsWith('/me/cart');

  // If not a protected route, allow access
  if (!isAdminRoute && !isCartRoute) {
    return NextResponse.next();
  }

  // If no token (user not logged in), redirect to login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, check if user has admin or moderator role
  if (isAdminRoute) {
    if (token.role !== 'admin' && token.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // User is authenticated (and authorized for admin routes), allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', // Protects /admin and all sub-routes
    '/me/cart/:path*', // Protects /me/cart and all sub-routes
    '/me/cart', // Protects /me/cart exactly
  ],
};
