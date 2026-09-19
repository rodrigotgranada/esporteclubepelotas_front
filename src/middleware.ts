import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect /verify-email route
  if (request.nextUrl.pathname.startsWith('/verify-email')) {
    const pendingEmail = request.cookies.get('pendingVerificationEmail');
    
    if (!pendingEmail) {
      // Se não houver email pendente no cookie, não deveria estar nesta tela
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Dashboard protection (example for future use)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const refreshToken = request.cookies.get('refresh_token');
    // Note: in a real app you might also want to check the token validity, 
    // but the backend will reject invalid tokens anyway.
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/verify-email', '/dashboard/:path*'],
};
