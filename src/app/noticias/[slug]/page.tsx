import { Metadata } from 'next';
import { NewsDetailFeature } from '@/features/news/ui/pages/NewsDetailFeature';
import { fetchArticleServer, buildNewsJsonLd } from '@/features/news/utils/news-seo.utils';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecpelotas.com.br';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleServer(slug);

  if (!article) {
    return {
      title: `Notícia não encontrada | Esporte Clube Pelotas`,
      description: `A notícia solicitada não foi encontrada ou não está mais disponível.`,
    };
  }

  const title = `${article.title} | E.C. Pelotas`;
  const description = article.summary || article.subtitle || `Leia a matéria completa no portal oficial do Lobo.`;
  const articleUrl = `${DEFAULT_SITE_URL}/noticias/${article.slug}`;
  const images = article.coverImage ? [{ url: article.coverImage, alt: article.title }] : [];

  return {
    title,
    description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url: articleUrl,
      title: article.title,
      description,
      siteName: 'Esporte Clube Pelotas',
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      tags: article.tags,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function NoticiaSlugPage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleServer(slug);
  const jsonLd = article ? buildNewsJsonLd(article, DEFAULT_SITE_URL) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <NewsDetailFeature slug={slug} />
    </>
  );
}


