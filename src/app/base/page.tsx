import { Metadata } from 'next';
import { Suspense } from 'react';
import { YouthHubFeature } from '@/features/youth/ui/pages/YouthHubFeature';
import { LayoutContainer, Spinner } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Categorias de Base | E.C. Pelotas',
  description:
    'Conheça as categorias de base do Esporte Clube Pelotas na Boca do Lobo. Plantel Sub-20, Sub-17 e Sub-15, notícias oficiais, metodologia de formação e peneiras.',
  openGraph: {
    title: 'Categorias de Base - Crias da Boca | E.C. Pelotas',
    description:
      'Plantel de formação do Áureo-Cerúleo por categoria: Sub-20, Sub-17 e Sub-15, cobertura de jogos e avaliações.',
  },
};

export default function YouthBasePage() {
  return (
    <Suspense
      fallback={
        <LayoutContainer className="min-h-screen py-24 flex items-center justify-center">
          <Spinner size={32} />
        </LayoutContainer>
      }
    >
      <YouthHubFeature />
    </Suspense>
  );
}
