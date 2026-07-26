import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.AUTH_SECRET || 'default-secret-key-123';
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/4d31n';

  // Parse session cookie
  const cookie = request.cookies.get('session')?.value;
  let session = null;
  if (cookie) {
    try {
      const { payload } = await jwtVerify(cookie, key, { algorithms: ['HS256'] });
      session = payload;
    } catch (e) {
      // invalid/expired token — treat as logged out
    }
  }

  // Block access to /admin if not logged in
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect away from login page if already logged in
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (isProtectedRoute && session) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-auth", "1");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/4d31n'],
};
