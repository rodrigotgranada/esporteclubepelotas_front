import { Metadata } from 'next';
import { Suspense } from 'react';
import { SquadFeature } from '@/features/football/ui/pages/SquadFeature';
import { LayoutContainer, Spinner } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Elenco & Comissões Técnicas | E.C. Pelotas',
  description: 'Conheça o plantel de atletas, categorias de base, futebol feminino e comissão técnica do Esporte Clube Pelotas na Boca do Lobo.',
  openGraph: {
    title: 'Elenco Oficial do Lobo | E.C. Pelotas',
    description: 'Plantel de jogadores da Boca do Lobo por temporada e categoria.',
  },
};

export default function ElencoPage() {
  return (
    <Suspense
      fallback={
        <LayoutContainer className="min-h-screen py-24 flex items-center justify-center">
          <Spinner size={32} />
        </LayoutContainer>
      }
    >
      <SquadFeature />
    </Suspense>
  );
}
