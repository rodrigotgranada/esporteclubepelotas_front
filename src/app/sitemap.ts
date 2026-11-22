import type { MetadataRoute } from 'next';
import { fetchPublicServerJson } from '@/shared/utils/seo-fetch';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecpelotas.com.br';

const STATIC_ROUTES = [
  '/',
  '/noticias',
  '/elenco',
  '/jogos',
  '/base',
  '/base/elencos',
  '/base/materias',
  '/feminino',
  '/feminino/elencos',
  '/feminino/materias',
  '/estadio',
  '/idolos',
  '/historia',
  '/hino',
  '/simbolos',
  '/uniformes',
  '/loja',
  '/socio',
  '/transparencia',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '/' || route === '/noticias' ? 'hourly' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));

  const [newsRes, idolsRes] = await Promise.all([
    fetchPublicServerJson<{ data?: Array<{ slug?: string; updatedAt?: string; publishedAt?: string }> }>(
      '/news?limit=50',
      300,
    ),
    fetchPublicServerJson<{ data?: Array<{ slug?: string; updatedAt?: string }> }>(
      '/idols?limit=50',
      300,
    ),
  ]);

  if (newsRes?.data) {
    newsRes.data.forEach((article) => {
      if (!article.slug) return;
      entries.push({
        url: `${SITE_URL}/noticias/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : article.publishedAt ? new Date(article.publishedAt) : now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });
  }

  if (idolsRes?.data) {
    idolsRes.data.forEach((idol) => {
      if (!idol.slug) return;
      entries.push({
        url: `${SITE_URL}/idolos/${idol.slug}`,
        lastModified: idol.updatedAt ? new Date(idol.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  }

  return entries;
}

