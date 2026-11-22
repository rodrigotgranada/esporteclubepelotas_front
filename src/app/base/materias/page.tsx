import { Metadata } from 'next';
import { Suspense } from 'react';
import { YouthArticlesFeature } from '@/features/youth/ui/pages/YouthArticlesFeature';
import { LayoutContainer, Spinner, ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Notícias & Cobertura da Base | E.C. Pelotas',
  description:
    'Todas as notícias, resultados, jogos e coberturas das categorias de base do Esporte Clube Pelotas — Sub-20, Sub-17 e Sub-15 na Boca do Lobo.',
  openGraph: {
    title: 'Notícias das Crias da Boca | E.C. Pelotas',
    description:
      'Acompanhe o dia a dia e as conquistas dos jovens talentos do Esporte Clube Pelotas.',
  },
};

export default function YouthArticlesPage() {
  return (
    <ModuleGuard moduleSlug="youth" moduleName="Categorias de Base">
      <Suspense
        fallback={
          <LayoutContainer className="min-h-screen py-24 flex items-center justify-center">
            <Spinner size={32} />
          </LayoutContainer>
        }
      >
        <YouthArticlesFeature />
      </Suspense>
    </ModuleGuard>
  );
}

