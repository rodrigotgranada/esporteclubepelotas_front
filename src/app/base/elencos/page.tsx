import { Metadata } from 'next';
import { Suspense } from 'react';
import { YouthSquadsFeature } from '@/features/youth/ui/pages/YouthSquadsFeature';
import { LayoutContainer, Spinner } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Elencos das Categorias de Base | E.C. Pelotas',
  description:
    'Plantéis oficiais do Esporte Clube Pelotas nas categorias Sub-20, Sub-17 e Sub-15. Conheça as promessas do Lobo, comissões técnicas e estatísticas.',
  openGraph: {
    title: 'Elencos das Crias da Boca | E.C. Pelotas',
    description:
      'Plantéis de formação do Pelotas: Sub-20 (Júnior), Sub-17 (Juvenil) e Sub-15 (Infantil).',
  },
};

export default function YouthSquadsPage() {
  return (
    <Suspense
      fallback={
        <LayoutContainer className="min-h-screen py-24 flex items-center justify-center">
          <Spinner size={32} />
        </LayoutContainer>
      }
    >
      <YouthSquadsFeature />
    </Suspense>
  );
}

