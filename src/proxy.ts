import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Tornar a rota /gestao e todas as suas subrotas 100% invisíveis para qualquer um não autenticado ou não autorizado
  if (request.nextUrl.pathname.startsWith('/gestao')) {
    const accessToken = request.cookies.get('ecp_access_token')?.value;

    if (!accessToken) {
      // Sem login -> reescreve silenciosamente como 404 (não revela que a rota existe)
      request.nextUrl.pathname = '/404';
      return NextResponse.rewrite(request.nextUrl);
    }

    try {
      // Extrair payload do JWT (Header.Payload.Signature)
      const payloadBase64 = accessToken.split('.')[1];
      const payloadString = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadString);

      // Status PENDENTE -> reescreve como 404 (ou se preferir, mantém invisível)
      if (payload.status === 'PENDING') {
        request.nextUrl.pathname = '/404';
        return NextResponse.rewrite(request.nextUrl);
      }

      // Checagem de Role
      const roleName = payload.role?.name || payload.role;
      if (roleName !== 'ADMIN' && roleName !== 'OWNER') {
        // Não autorizado -> reescreve silenciosamente como 404
        request.nextUrl.pathname = '/404';
        return NextResponse.rewrite(request.nextUrl);
      }

    } catch (e) {
      // Token adulterado ou com formato inválido -> reescreve silenciosamente como 404
      request.nextUrl.pathname = '/404';
      return NextResponse.rewrite(request.nextUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gestao/:path*'],
};
