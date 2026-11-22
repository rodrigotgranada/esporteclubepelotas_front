import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  if (configuredSecret) {
    const provided = request.headers.get('x-revalidate-secret');
    if (provided !== configuredSecret) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { path?: string; paths?: string[] };
    const targets = Array.isArray(body.paths)
      ? body.paths
      : body.path
      ? [body.path]
      : ['/'];

    targets
      .filter((p) => typeof p === 'string' && p.startsWith('/'))
      .forEach((p) => revalidatePath(p));

    return NextResponse.json({ revalidated: true, paths: targets });
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }
}

