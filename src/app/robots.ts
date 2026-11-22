import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecpelotas.com.br';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/gestao/', '/api/', '/profile/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

