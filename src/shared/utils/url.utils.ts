export function sanitizeSafeUrl(rawUrl?: string | null, fallback = '#'): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return fallback;
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return fallback;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    (trimmed.startsWith('/') && !trimmed.startsWith('//')) ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }

  return fallback;
}

export function isSafeRelativeRedirect(rawPath?: string | null): boolean {
  if (!rawPath || typeof rawPath !== 'string') {
    return false;
  }
  const trimmed = rawPath.trim();
  return trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\');
}

