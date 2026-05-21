import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('auth-token')?.value;

  if (!token && !PUBLIC_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && PUBLIC_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL('/tickets', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};