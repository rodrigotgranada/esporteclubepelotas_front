import { Metadata } from 'next';
import { NewsDetailFeature } from '@/features/news/ui/pages/NewsDetailFeature';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Notícia | Esporte Clube Pelotas`,
    description: `Acompanhe os detalhes da notícia no portal oficial do Esporte Clube Pelotas.`,
  };
}

export default async function NoticiaSlugPage({ params }: Props) {
  const { slug } = await params;
  return <NewsDetailFeature slug={slug} />;
}
