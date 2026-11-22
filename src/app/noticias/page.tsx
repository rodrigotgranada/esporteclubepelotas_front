import { Metadata } from 'next';
import { Suspense } from 'react';
import { NewsFeedFeature } from '@/features/news/ui/pages/NewsFeedFeature';
import { ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Notícias | Esporte Clube Pelotas',
  description: 'Acompanhe as últimas notícias, jogos, contratações e novidades do E.C. Pelotas.',
};

export default function NoticiasPage() {
  return (
    <ModuleGuard moduleSlug="news" moduleName="Notícias & Cobertura">
      <Suspense fallback={null}>
        <NewsFeedFeature />
      </Suspense>
    </ModuleGuard>
  );
}
