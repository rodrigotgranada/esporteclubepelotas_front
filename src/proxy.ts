import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_MANAGEMENT_ROLES = new Set(['ADMIN', 'OWNER', 'EDITOR']);

export function proxy(request: NextRequest) {
  // Tornar a rota /gestao e todas as suas subrotas invisíveis para usuários não autenticados ou sem cargo administrativo/editorial
  if (request.nextUrl.pathname.startsWith('/gestao')) {
    const accessToken = request.cookies.get('ecp_access_token')?.value;

    if (!accessToken || accessToken.split('.').length !== 3) {
      request.nextUrl.pathname = '/404';
      return NextResponse.rewrite(request.nextUrl);
    }

    try {
      const payloadBase64 = accessToken.split('.')[1];
      const payloadString = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadString);

      // Valida expiração básica do token JWT
      if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
        request.nextUrl.pathname = '/404';
        return NextResponse.rewrite(request.nextUrl);
      }

      if (payload.status === 'PENDING') {
        request.nextUrl.pathname = '/404';
        return NextResponse.rewrite(request.nextUrl);
      }

      const rawRole = payload.role?.name || payload.role || '';
      const roleName = typeof rawRole === 'string' ? rawRole.toUpperCase() : '';
      if (!ALLOWED_MANAGEMENT_ROLES.has(roleName)) {
        request.nextUrl.pathname = '/404';
        return NextResponse.rewrite(request.nextUrl);
      }
    } catch {
      request.nextUrl.pathname = '/404';
      return NextResponse.rewrite(request.nextUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gestao/:path*'],
};
