import { NewsArticleData } from '@/features/admin/services/admin-news.service';

/**
 * Busca a matéria no servidor para pré-renderização de metadados e SEO.
 */
export async function fetchArticleServer(slug: string): Promise<NewsArticleData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998';
  try {
    const res = await fetch(`${apiUrl}/news/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 }, signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`[fetchArticleServer] Erro ao buscar artigo para SEO (${slug}):`, err);
    return null;
  }
}

/**
 * Constrói o schema oficial schema.org/NewsArticle para indexação no Google Notícias e Discover.
 */
export function buildNewsJsonLd(article: NewsArticleData, siteUrl: string) {
  const authorName =
    article.reporterName ||
    (typeof article.author === 'object' && article.author
      ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
      : 'Redação E.C. Pelotas');

  const images: string[] = [];
  if (article.coverImage) images.push(article.coverImage);
  if (Array.isArray(article.gallery)) {
    article.gallery.forEach((img) => {
      if (img && !images.includes(img)) images.push(img);
    });
  }

  const articleUrl = `${siteUrl}/noticias/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.title,
    description: article.summary || article.subtitle || article.title,
    image: images.length > 0 ? images : undefined,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: [
      {
        '@type': 'Person',
        name: authorName,
        url: siteUrl,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Esporte Clube Pelotas',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };
}

