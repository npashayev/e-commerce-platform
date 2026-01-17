import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Get the JWT token from the request
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // If no token (user not logged in), redirect to login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has admin or moderator role
  if (token.role !== 'admin' && token.role !== 'moderator') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // User is authenticated and authorized, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Protects /admin and all sub-routes
};
