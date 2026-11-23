const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998';

export async function fetchPublicServerJson<T>(
  path: string,
  revalidateSeconds = 60,
  timeoutMs = 4000,
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: revalidateSeconds },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

