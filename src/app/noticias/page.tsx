import { Metadata } from 'next';
import { Suspense } from 'react';
import { NewsFeedFeature } from '@/features/news/ui/pages/NewsFeedFeature';

export const metadata: Metadata = {
  title: 'Notícias | Esporte Clube Pelotas',
  description: 'Acompanhe as últimas notícias, jogos, contratações e novidades do E.C. Pelotas.',
};

export default function NoticiasPage() {
  return (
    <Suspense fallback={null}>
      <NewsFeedFeature />
    </Suspense>
  );
}

